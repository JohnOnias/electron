const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const {session } = require('electron');
const { rejects } = require('assert');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");



// ################################################## envio de emails #################################################################

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ifce.electron.testes@gmail.com",       // seu e-mail
        pass: "gnfedrphwmaaewiv"      // senha de app do Gmail
    }
});

async function enviarTokenEmail(email, token) {
    const mailOptions = {
        from: '"App Recuperação de Senha" ifce.electron.testes@gmail.com',
        to: email,
        subject: "Recuperação de Senha",
        html: `
            <p>Você solicitou a redefinição de senha.</p>
            <p>Use este token para redefinir sua senha:</p>
            <h3>${token}</h3>
            <p>O token expira em 15 minutos.</p>
        `
    };

    return transporter.sendMail(mailOptions);
}



//################################################# geração de tokens ######################################################
// gera o token de reset
function gerarToken() {
    return crypto.randomBytes(32).toString("hex"); // token de 64 caracteres
}
function calcularExpiracao(minutos = 15) {
    return Date.now() + minutos * 60 * 1000; // expira em X minutos
}

// ##################################################### validar tokens ########################################################

async function validarToken(token) {
    const db = await conn();
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 'Administrador' as tipo, id, reset_expires 
            FROM tb_Administrador 
            WHERE reset_token = ?
            
            UNION ALL
            
            SELECT 'Funcionario' as tipo, id, reset_expires 
            FROM tb_Funcionarios 
            WHERE reset_token = ?
        `;
        db.all(query, [token, token], (err, rows) => {
            db.close();
            if (err) return reject(err);
            if (!rows || rows.length === 0) return resolve(null); // token não existe
            const usuario = rows[0];
            if (usuario.reset_expires < Date.now()) return resolve(null); // token expirado
            resolve(usuario); // token válido
        });
    });
}
// ##################################################### FUNÇOES #########################################################################################

// atualiza a senha
async function atualizarSenha(token, novaSenha) {
    const db = await conn();
    const usuario = await validarToken(token);
    if (!usuario) return null;

    const hashed = await bcrypt.hash(novaSenha, 10);

    return new Promise((resolve, reject) => {
        let table = usuario.tipo === "Administrador" ? "tb_Administrador" : "tb_Funcionarios";
        db.run(
            `UPDATE ${table} SET senha=?, reset_token=NULL, reset_expires=NULL WHERE id=?`,
            [hashed, usuario.id],
            function(err) {
                db.close();
                if (err) return reject(err);
                resolve(true);
            }
        );
    });
}

// salva o token no banco
async function salvarToken(email) {
    const db = await conn();
    const token = gerarToken();
    const expiracao = calcularExpiracao(15);

    return new Promise((resolve, reject) => {
        // Atualiza token no Administrador
        db.run(
            `UPDATE tb_Administrador SET reset_token=?, reset_expires=? WHERE email=?`,
            [token, expiracao, email],
            function (err) {
                if (err) {
                    // Se não encontrar, tenta Funcionario
                    db.run(
                        `UPDATE tb_Funcionarios SET reset_token=?, reset_expires=? WHERE email=?`,
                        [token, expiracao, email],
                        function (err2) {
                            db.close();
                            if (err2) reject(err2);
                            else resolve({ token, expiracao });
                        }
                    );
                } else if (this.changes === 0) {
                    // nenhum registro atualizado
                    db.close();
                    resolve(null);
                } else {
                    db.close();
                    resolve({ token, expiracao });
                }
            }
        );
    });
}

// conexão com o banco de dados
function conn() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(
            path.join(__dirname, './src/public/BD/database.db'), 
            (err) => {
                if (err) {
                    console.error('Database connection failed:', err); 
                    reject(err);
                } else {
                    console.log('Database connected!'); 
                    resolve(db);
                }
            }
        );
    });
}

// função de login e auth
async function loginAuth(email, senhaDigitada) {
  const db = await conn();
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 'adm' as tipo, id, nome, email, senha
      FROM tb_Administrador
      WHERE email = ?
      UNION ALL
      SELECT 'funcionario' as tipo, id, nome, email, senha
      FROM tb_Funcionarios
      WHERE email = ?
      LIMIT 1
    `;
    db.all(query, [email, email], async (err, rows) => {
      db.close();
      if (err) return reject(err);
      if (!rows || rows.length === 0) return resolve(null); // usuário não encontrado

      const usuario = rows[0]; // pega o primeiro resultado
      try {
        const senhaValida = await bcrypt.compare(senhaDigitada, usuario.senha);
        if (!senhaValida) return resolve(null); // senha incorreta

        // Não envie o hash para o renderer
        const retorno = {
          tipo: usuario.tipo, // 'adm' ou 'funcionario'
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        };
        return resolve(retorno);
      } catch (e) {
        return reject(e);
      }
    });
  });
}



// função para redefinir senha 
async function verificarEmail(emailResetTest) {
    const db = await conn();
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 'Administrador' as tipo, email 
            FROM tb_Administrador
            WHERE email = ?
            UNION ALL
            SELECT 'Funcionario' as tipo, email 
            FROM tb_Funcionarios 
            WHERE email = ?
        `;
        db.all(query, [emailResetTest, emailResetTest], (err, rows) => {
            db.close(); 

            if (err) {
                console.error('Erro ao consultar email:', err);
                reject(err);
            } else {
                if (rows.length > 0) {
                    console.log('Email encontrado!');      
                }
                resolve(rows);
            }
        });
    });
}

let resetWindow = null; 
// cria a tela de redefinirSenha
async function criarTelaReset() {
        nativeTheme.themeSource = 'dark';
        const resetWindow = new BrowserWindow ({
            width: 450, 
            height: 450, 
            resizable: false, 
            autoHideMenuBar: true,
        webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true, 
                nodeIntegration: false
            }
        })
        resetWindow.loadFile('./src/views/login/ForgotPassword.html');

        resetWindow.on('closed', () => {
                resetWindow = null;
        });

        return resetWindow; 
}
// função cadastrar funcionario 
async function  cadastrarFuncionario(nome, cpf, email, senha, tipoFuncionario) {
     const db = await conn();
    return new Promise((resolve) => {
        const query = `
            INSERT INTO tb_Funcionarios (nome, cpf, email, senha, tipo)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.run(query, [nome, cpf, email, senha, tipoFuncionario], function(err){
            if(err){
                resolve({ success: false, error: err.message });
            } else {
                resolve({ success: true });
            }
            db.close();
        });
    });
}
    
// ######################################### CRIAÇÃO DE TELAS ################################################################

//cria a tela de login 
const loginWindow = () => {
    nativeTheme.themeSource = 'dark';
    const login = new BrowserWindow({
        width: 1920,
        height: 1080,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, 
            nodeIntegration: false
        }
    });
    login.loadFile('./src/views/login/login.html');
}

 function criarTelaCadastroFuncionario() {
    nativeTheme.themeSource = 'dark';
    const win = new BrowserWindow({
        width: 350,
        height: 550,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true
        }
    });

    win.loadFile('./src/views/admin/cadastroFuncionario.html');

}

// aqui chama a janela principal quando se clica no app
app.whenReady().then(() => {
  loginWindow(); 
  criarTelaCadastroFuncionario();
  

// so abre outra janela se todas estiverem fechadas (para MAC)
 app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// quando a janela for fechada encerra a aplicação (para WIN e Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});




// ######################################################### ROTAS #########################################################################

ipcMain.handle("login-auth", async (event, email, senha) => {
   return await loginAuth(email, senha);
});

ipcMain.handle('cadastrar-funcionario', async (event, nome, cpf, email, senha, tipoFuncionario) => {
    return await cadastrarFuncionario(nome, cpf, email, senha, tipoFuncionario);
});

ipcMain.handle("abrirResetTela", async () => {
    if (!resetWindow) await criarTelaReset();
});
ipcMain.handle("fecharResetTela", async () => {
    if (resetWindow) {
        resetWindow.close();
        resetWindow = null;
    }
});
ipcMain.handle("chamar-redefinir", async(event, emailResetTest) => {
   return await verificarEmail(emailResetTest);
});

// abre a tela de verificação de token
let abrirTelaDeVerificacaoToken = null; 
ipcMain.handle("abrirTelaDeVerificacaoToken", async() => {
if(!abrirTelaDeVerificacaoToken){
     nativeTheme.themeSource = 'dark';
        abrirTelaDeVerificacaoToken = new BrowserWindow ({
            width: 450, 
            height: 450, 
            resizable: false, 
            autoHideMenuBar: true,
        webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true, 
                nodeIntegration: false
            }
        })
        abrirTelaDeVerificacaoToken.loadFile('./src/views/login/reset.html');
        abrirTelaDeVerificacaoToken.on('closed', () => {
                abrirTelaDeVerificacaoToken = null;
        });
}
});

ipcMain.handle("gerar-token", async (event, email) => {
    const resultado = await salvarToken(email);
    if (resultado) {
        console.log("Token gerado para:", email);
    }
    return resultado; 
});
ipcMain.handle("gerar-e-enviar-token", async (event, email) => {
    const resultado = await salvarToken(email); // gera token e salva no DB
    if (!resultado) return null;

    try {
        await enviarTokenEmail(email, resultado.token);
        console.log("Token enviado para o e-mail:", email);
        return { sucesso: true };
    } catch (err) {
        console.error("Erro ao enviar e-mail:", err);
        return { sucesso: false, erro: err.message };
    }
});

ipcMain.handle("validar-token", async (event, token) => {
    const usuario = await validarToken(token);
    return usuario ? true : false;
});

ipcMain.handle("resetar-senha", async (event, token, novaSenha) => {
    const sucesso = await atualizarSenha(token, novaSenha);
    return sucesso;
});
ipcMain.handle('abrirCadastroFuncionario', async () => {
    return await criarTelaCadastroFuncionario();
});
