import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {conn } from '../db/conn.js';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





export async function cadastrarMesa(numero_mesa, status, n_cadeiras) {
  const db = await conn();
  try {

    if (!numero_mesa) {
      throw new Error("Número da mesa é obrigatório.");
    }

    const existingMesa = await verificarMesa(db, numero_mesa);
    if (existingMesa.length > 0) {
      throw new Error("Mesa já cadastrada.");
    }

    await new Promise((resolve, reject) => {
      const query = `INSERT INTO tb_Mesas (numero, status, n_cadeiras) VALUES (?, ?, ?)`;
      db.run(query, [numero_mesa, status, n_cadeiras], function(err) {
        if (err) {
          console.error("Erro ao cadastrar mesa:", err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });

    return { success: true };
  } catch (err) {
    console.error(err.message);
    return { success: false, error: err.message };
  } finally {
    db.close(); 
  }
}


export async function criarTelaCadastroMesa() {
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

  win.loadFile('./src/views/gerente/cadastroMesas.html');
  return win;
}