
import { conn } from '../../database/db/conn.js';
import bcrypt from 'bcryptjs';

export async function login(email, senha){
  const db = await conn();
  
  return new Promise((resolve, reject) => {
    const query = `
      SELECT tipo, id, nome, email, senha FROM (
        SELECT 'adm' AS tipo, id, nome, email, senha
        FROM tb_Administrador
        WHERE email = ?
        UNION ALL
        SELECT tipo, id, nome, email, senha
        FROM tb_Funcionarios
        WHERE email = ?
      ) LIMIT 1
    `;

    db.get(query, [email, email], async (err, usuario) => {
      db.close();
      if (err) return reject(err);
      if (!usuario) return resolve(null); 

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) return resolve(null); // senha incorreta

     
      resolve({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo 
      });
    });
  });
};



