import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {conn } from '../db/conn.js';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export function criarTelaCadastroCategoria() {
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



export async function cadastrarCategoria(nomeCategoria, status) {

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
