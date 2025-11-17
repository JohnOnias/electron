import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {conn } from '../db/conn.js';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export async function login(email, senha){
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


export async function criarLoginWindow() {
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
