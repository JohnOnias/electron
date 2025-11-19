import {conn } from '../db/conn.js';




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


