 import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {conn } from '../db/conn.js';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export async function getMesas(){
    const db = await conn();
  return new Promise((resolve, reject) => {
    db.all("SELECT id, numero, status, n_cadeiras FROM tb_Mesas order by numero", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows); 
    });
  })};