import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {conn } from '../../database/db/conn.js';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export async function verificarGerente(tipoFuncionario) {
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