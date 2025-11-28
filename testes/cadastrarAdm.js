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

//let nome = 'Adm';
//let email = 'adm@adm.com';
//let senha = 'adm123';
//await cadastrarAdm(nome, email, senha); 
export async function mudarStatus(numero_mesa){
  const ocupado = "Ocupada";

  console.log("entrei no mudar Status!"); 
  const db = await conn();

  return new Promise((resolve, reject) => {
    const query = `UPDATE tb_Mesas SET status = ? WHERE numero = ?`;

    db.run(query, [ocupado, numero_mesa], function(err) {
      if (err) {
        console.error("Erro ao mudar status:", err);
        reject(err);
      } else {
     
        resolve({ success: true, changes: this.changes });
      }

      db.close();
    });

  });
}
await mudarStatus(20); 
console.log("cadastrado com sucesso!"); 




