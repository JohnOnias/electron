import { conn } from "../../db/conn.js";
export async function cadastrarCategoria(nomeCategoria, status) {

        const db = await conn(); 
        return new Promise((resolve) => {
            const query = `INSERT INTO tb_Categorias (nome, status) VALUES (?, ?)`;
            db.run(query, [nomeCategoria, status], function(err) {
                db.close();
                if (err) resolve({ success: false, error: err.message });
                else resolve(true);
            });
        });
        
}
 export async function getCategoria(){ 
  const db = await conn(); 
  return new Promise((resolve, reject) => {
    db.all("SELECT id, nome, status FROM tb_Categorias", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  })};