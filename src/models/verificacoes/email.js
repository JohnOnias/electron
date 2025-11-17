

import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {conn } from '../db/conn.js';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export async function verificarEmailCadastrado(email){
  const db = await conn();
  return new Promise((resolve, reject) => {
    const query = `SELECT nome FROM tb_Funcionarios WHERE email = ?`;
    db.all(query, [email], (err, rows) => {
      db.close();
      if (err) {
        console.error("Erro ao verificar e-mail:", err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}


export async function verificarEmailReset(emailResetTest) {
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

 export async function enviarTokenEmail(email, token) {
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
