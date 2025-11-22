import bcrypt from 'bcrypt';
let saltRounds = 16; 
import {conn} from './conn.js'


async function cadastrarAdm(nome, email, senha) {
  const hash = await bcrypt.hash(senha, saltRounds);
        const db = await conn(); 
        return new Promise((resolve) => {
            const query = `INSERT INTO tb_Administrador (nome, email, senha) VALUES (?, ?, ?)`;
            db.run(query, [nome, email, hash], function(err) {
                db.close();
                if (err) resolve({ success: false, error: err.message });
                else resolve(true);
            });
        });
        
}

let nome = 'Adm';
let email = 'adm@adm.com';
let senha = 'adm123';
await cadastrarAdm(nome, email, senha); 

console.log("cadastrado com sucesso!"); 




