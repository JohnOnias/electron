const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const {session } = require('electron');



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
async function loginAuth(email, senha) {
    const db = await conn();

    return new Promise((resolve, reject) => {
        const query = `
            SELECT 'adm' as tipo, id, nome, email 
            FROM tb_Administrador 
            WHERE email = ? AND senha = ?
            
            UNION ALL  
            
            SELECT 'funcionario' as tipo, id, nome, email 
            FROM tb_Funcionarios 
            WHERE email = ? AND senha = ?
        `;
        
        db.all(query, [email, senha, email, senha], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
            db.close();
            
        });
    });
}



// finção pra criar as telas cria as telas(pfv não toque nisso)
const createWindow = () => {
    nativeTheme.themeSource = 'dark'
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    autoHideMenuBar: true

    //para adcionar um icone
    //,
    //icon: 'local da imagem aqui'
  })
     // renderiza a janela 
  win.loadFile('./src/views/index.html')
}

// função pra criar a tela de login 
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
    login.loadFile('./src/views/login.html');
}

// aqui chama a janela principal quando se clica no app
app.whenReady().then(() => {
  loginWindow(); 

// so abre outra janela se todas estiverem fechadas (para MAC)
 app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// quando a janela for fechada encerra a aplicação (para WIN e Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
// rota de login
ipcMain.handle("login-auth", async (event, email, senha) => {
   return await loginAuth(email, senha);
});