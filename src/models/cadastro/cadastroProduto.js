import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {conn } from '../db/conn.js';




// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// tela de cadastro de produto
export function criarTelaCadastroProduto() {
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

export async function cadastrarProduto(nome, preco, categoria_id, descricao) {
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