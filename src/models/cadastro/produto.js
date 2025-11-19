import {conn } from '../../database/db/conn.js';




export async function cadastrarProduto(nome, preco, categoria_id, descricao) {
  const db = await conn();
  return new Promise((resolve) => {
    const query = `
      INSERT INTO tb_Produtos (nome, preco, categoria_id, descricao)
      VALUES (?, ?, ?, ?)
    `;
    db.run(query, [nome, preco, categoria_id, descricao], function (err) {
      if (err) {
        resolve({ success: false, error: err.message });
      } else {
        // retornar true para indicar sucesso, consistente com outras rotas
        resolve(true);
      }
      db.close();
    });
  });
}

export async function getProdutosID(idCategoria){
    const db = await conn();
    return new Promise((resolve, reject) => {
        const query = `SELECT id, nome, preco, descricao FROM tb_Produtos WHERE categoria_id = ?`;  
        db.all(query, [idCategoria], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    })};