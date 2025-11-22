import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { conn } from '../../database/db/conn.js';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export async function verificarCpf(cpf){
  const db = await conn();
  return new Promise((resolve, reject) => {
    const query = `SELECT nome FROM tb_Funcionarios WHERE cpf = ?`;
    db.all(query, [cpf], (err, row) => {
      db.close();
      if (err) {
        console.error("Erro ao verificar CPF:", err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}
