const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const {session } = require('electron');
const { rejects } = require('assert');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const saltRounds = 10; 

//######################################################## variaveis globais ##################################################
let loginWindow = null; 
let resetWindow = null;
let tokenWindow = null;
let adm = null;  
let VerificacaoToken = null; 


// ################################################## envio de emails #################################################################

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ifce.electron.testes@gmail.com",       // seu e-mail
        pass: "gnfedrphwmaaewiv"      // senha de app do Gmail
    }});

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
    }; return transporter.sendMail(mailOptions);
}



//################################################# GERAÇÃO DE TOKENS ######################################################
// gera o token de reset
function gerarToken() {
    return crypto.randomBytes(32).toString("hex"); // token de 64 caracteres
}
function calcularExpiracao(minutos = 15) {
    return Date.now() + minutos * 60 * 1000; // expira em X minutos
}


// ##################################################### VALIDAR TOKENS ########################################################

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
                }});});}

// ################################################### FUNÇOES BANCO DE DADOS #############################################

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
}});});}


// ##################################################### FUNÇOES LOGIN #########################################################################################


async function login(email, senha){
  const db = await conn();
  
  return new Promise((resolve, reject) => {
    const query = `
      SELECT tipo, id, nome, email, senha FROM (
        SELECT 'adm' AS tipo, id, nome, email, senha
        FROM tb_Administrador
        WHERE email = ?
        UNION ALL
        SELECT tipo, id, nome, email, senha
        FROM tb_Funcionarios
        WHERE email = ?
      ) LIMIT 1
    `;

    db.get(query, [email, email], async (err, usuario) => {
      db.close();
      if (err) return reject(err);
      if (!usuario) return resolve(null); 

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) return resolve(null); // senha incorreta

     
      resolve({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo 
      });
    });
  });
};

   
// ####################################### VERIFICAÇõES DE EMAIL, SENHA E TIPOS ##############################################################


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

// verifica se existe um gerente cadastrado 
async function verificarGerente(tipoFuncionario) {
  const db = await conn();
  return new Promise((resolve, reject) => {
    const query = `SELECT id, nome FROM tb_Funcionarios WHERE tipo = ?`
    db.all(query, [tipoFuncionario], (err, rows) => {
      db.close();
      if (err) {
        console.error("Erro ao pesquisar gerente", err);
        reject(err);
        return;
      }
      resolve(rows); 
    });
  });
}


//#################################################### FUNÇOES DE CADASTRO ###################################################

// função cadastrar funcionario 
async function cadastrarFuncionario(nome, cpf, email, senha, tipoFuncionario) {
  const db = await conn();
  if (tipoFuncionario === "gerente") {
    const gerente = await verificarGerente(tipoFuncionario);
    if (gerente.length > 0) {
      return { success: false, error: "Já existe um gerente cadastrado!"}; 
    }
  }
   const hash = await bcrypt.hash(senha, saltRounds);
  return new Promise((resolve) =>  {

    const query = `
      INSERT INTO tb_Funcionarios (nome, cpf, email, senha, tipo)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [nome, cpf, email, hash, tipoFuncionario], function (err) {
      if (err) {
        resolve({ success: false, error: err.message });
      } else {
        resolve({ success: true });
      }
      db.close();
    });
  });
}

async function cadastrarCategoria(nomeCategoria, status) {
    
        const db = await conn(); 
        return new Promise((resolve) => {
            const query = `INSERT INTO tb_Categorias (nome, status) VALUES (?, ?)`;
            db.run(query, [nomeCategoria, status], function(err) {
                db.close();
                if (err) resolve({ success: false, error: err.message });
                else resolve(true);
            });
        });
        
}


async function cadastrarProduto(nome, preco, categoria_id, descricao) {
  const db = await conn();
  return new Promise((resolve) => {
    const query = `
      INSERT INTO tb_Produtos (nome, preco, categoria_id, descricao)
      VALUES (?, ?, ?, ?)
    `;
    db.run(query, [nome, preco, categoria_id, descricao], function (err) {
      if (err) {
        resolve({ success: false, error: err.message });
      } else {
        // retornar true para indicar sucesso, consistente com outras rotas
        resolve(true);
      }
      db.close();
    });
  });
}


// ######################################### CRIAÇÃO DE TELAS ################################################################


//cria a tela de login 
async function criarLoginWindow() {
    nativeTheme.themeSource = 'dark';
    loginWindow = new BrowserWindow({  
        width: 1920,
        height: 1080,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, 
            nodeIntegration: false
        }
    });
    loginWindow.loadFile('./src/views/login/login.html');
    
    // Evento para limpar a referência quando a janela fechar
    loginWindow.on('closed', () => {
        loginWindow = null;
    });
    
    return loginWindow; 
}

// cria a tela de redefinirSenha

async function criarTelaReset() {
  nativeTheme.themeSource = 'dark';
  resetWindow = new BrowserWindow ({
    width: 450, 
    height: 450, 
    resizable: false, 
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, 
      nodeIntegration: false
    }
  });

  resetWindow.loadFile('./src/views/login/ForgotPassword.html');

  resetWindow.on('closed', () => {
    resetWindow = null;
  });

  return resetWindow;
}

// criar tela de ADM

async function admWindow(){
    nativeTheme.themeSource = 'dark';
    const adm = new BrowserWindow({
        width: 1920,
        height: 1080,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, 
            nodeIntegration: false
        }
    });
    adm.loadFile('./src/views/admin/admin.html');
    return adm; 
}

// criar a tela de cadastro de funcionario 
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
            nodeIntegration: false 
        }
    });

    win.loadFile('./src/views/admin/cadastroFuncionario.html');
    return win; 
}

async function criarTelaVerificacaoToken() {
  nativeTheme.themeSource = 'dark';
  VerificacaoToken = new BrowserWindow ({
    width: 450, 
    height: 450, 
    resizable: false, 
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, 
      nodeIntegration: false
    }
  });

  VerificacaoToken.loadFile('./src/views/login/reset.html');
  VerificacaoToken.on('closed', () => {
    VerificacaoToken = null;
  });

  return VerificacaoToken;
}
// cria a tela de gerente

async function criarTelaGerente() {
    nativeTheme.themeSource = 'dark';
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true
        }
    });
    win.loadFile('./src/views/gerente/gerente.html'); 
    return win;
}

// cria a tela de cadastro categoria
function criarTelaCadastroCategoria() {
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
    win.loadFile('./src/views/gerente/cadastroCategoria.html'); 
}

// tela de cadastro de produto
function criarTelaCadastroProduto() {
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
    win.loadFile('./src/views/gerente/cadastroProduto.html'); 
}


// aqui chama a janela principal quando se clica no app
app.whenReady().then(() => {
    criarLoginWindow();
    criarTelaGerente(); 


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


// login auth 
ipcMain.handle("login", async (event, email, senha) => {
   return await login(email, senha);
});

// fechar login sa desgraça 
ipcMain.handle("fecharLogin", async () => {
    if (loginWindow && !loginWindow.isDestroyed()) {
        loginWindow.close();
        loginWindow = null;
        return { success: true, message: 'Janela de login fechada' };
    }
    return { success: false, message: 'Janela de login não encontrada' };
});

// cadastrar funcionario
ipcMain.handle('cadastrar-funcionario', async (event, nome, cpf, email, senha, tipoFuncionario) => {
    return await cadastrarFuncionario(nome, cpf, email, senha, tipoFuncionario);
});
// abrir tela de reset
ipcMain.handle("abrirResetTela", async () => {
    if (!resetWindow) await criarTelaReset();
});
// fechar tela de reset
ipcMain.handle("fecharResetTela", async () => {
    if (resetWindow) {
        resetWindow.close();
        resetWindow = null;
    }
});
// chama o redefinir
ipcMain.handle("chamar-redefinir", async(event, emailResetTest) => {
   return await verificarEmail(emailResetTest);
});



// chama a tela de cadastro de categoria 
ipcMain.handle('abrirCadastroCategoria', async () => {
    return await criarTelaCadastroCategoria();
});


// abre a tela de verificação de token
ipcMain.handle("abrirTelaDeVerificacaoToken", async () => {
  if (!VerificacaoToken) {
    await criarTelaVerificacaoToken();
    return { success: true };
  }
  return { success: false, message: 'Tela já aberta' };
});

ipcMain.handle('cadastrar-categoria', async (event, nomeCategoria, status) => {
        return await cadastrarCategoria(nomeCategoria, status); 
});

ipcMain.handle('cadastrarProduto', async (event, nome, preco, categoria_id, descricao) => {
  return await cadastrarProduto(nome, preco, categoria_id, descricao);
});


// gera token de verificação
ipcMain.handle("gerar-token", async (event, email) => {
    const resultado = await salvarToken(email);
    if (resultado) {
        console.log("Token gerado para:", email);
    }
    return resultado; 
});
// enviar token por email
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

// valida o token 
ipcMain.handle("validar-token", async (event, token) => {
    const usuario = await validarToken(token);
    return usuario ? true : false;
});

// atualiza a senha para a senha nova
ipcMain.handle("resetar-senha", async (event, token, novaSenha) => {
    const sucesso = await atualizarSenha(token, novaSenha);
    return sucesso;
});

// abrir tela de cadastro funcionario
ipcMain.handle("abrirCadastroFuncionario", async(event)=>{
       await criarTelaCadastroFuncionario(); 
        
});


// abrir tela de cadastro produtos
ipcMain.handle("abrirCadastroProduto", async(event)=>{
       await criarTelaCadastroProduto(); 
        
});

// chama a tela de gerente 
ipcMain.handle('abrirTelaGerente', async () => {
  try {
    await criarTelaGerente(); // notar await
    if (loginWindow && !loginWindow.isDestroyed()) {
      loginWindow.close();
      loginWindow = null;
    }
    return { success: true, message: 'Tela de Gerente aberta' };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
});

// chama a tela adm
ipcMain.handle('abrirTelaAdm', async () => {
  try {
    await admWindow(); // notar await
    if (loginWindow && !loginWindow.isDestroyed()) {
      loginWindow.close();
      loginWindow = null;
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-categorias', async (event) => {
    const db = await conn(); 
  return new Promise((resolve, reject) => {
    db.all("SELECT id, nome FROM tb_Categorias", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle('get-mesas', async () => {
  const db = await conn();

  return new Promise((resolve, reject) => {
    db.all("SELECT id, numero, status, n_cadeiras FROM tb_Mesas", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows); 
    });
  });
});



/* ipcMain.handle('abrirCadastroFuncionario', async (event) => {
    try {
        const win = criarTelaCadastroFuncionario();
        
        // Fecha a janela de login após abrir o cadastro
        if (loginWindow && !loginWindow.isDestroyed()) {
            loginWindow.close();
            loginWindow = null;
        }
        
        return { 
            success: true, 
            message: 'Tela de cadastro aberta e login fechado'
        };
    } catch (error) {
        console.error('Erro ao abrir tela de cadastro:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
});*/
