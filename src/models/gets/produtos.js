 import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {conn } from '../db/conn.js';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export async function getProdutosID(idCategoria){
    const db = await conn();
    return new Promise((resolve, reject) => {
        const query = `SELECT id, nome, preco, descricao FROM tb_Produtos WHERE categoria_id = ?`;  
        db.all(query, [idCategoria], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    })};