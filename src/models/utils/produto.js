import {conn } from '../../database/db/conn.js';

export async function getProdutosID(idCategoria){
    const db = await conn();
    return new Promise((resolve, reject) => {
        const query = `SELECT id, nome, preco, descricao FROM tb_Produtos WHERE categoria_id = ?`;  
        db.all(query, [idCategoria], (err, rows) => {
            db.close();
            if (err) reject(err);
            else resolve(rows);
        });
    })};

export async function getTodosProdutos(){
    const db = await conn();
    return new Promise((resolve, reject) => {
        const query = `SELECT id, nome, preco, descricao, categoria_id FROM tb_Produtos`;  
        db.all(query, [], (err, rows) => {
            db.close();
            if (err) reject(err);
            else resolve(rows);
        });
    })};

export async function adicionarProdutosPedido(pedidoId, produtos) {
    if (!pedidoId) {
        throw new Error("ID do pedido não foi definido");
    }

    if (!produtos || produtos.length === 0) {
        throw new Error("Nenhum produto para adicionar");
    }

    const db = await conn();
    return new Promise(async (resolve, reject) => {
        try {
            for (let produto of produtos) {
                const query = `
                    INSERT INTO tb_Itens_Pedidos (pedido_id, produto_id, quantidade, preco_unitario)
                    VALUES (?, ?, ?, ?)
                `;
                await new Promise((resolveItem, rejectItem) => {
                    db.run(query, [pedidoId, produto.id, produto.quantidade, produto.preco], function(err) {
                        if (err) {
                            console.error("Erro ao inserir item:", err);
                            rejectItem(err);
                        } else {
                            resolveItem();
                        }
                    });
                });
            }
            db.close();
            resolve({ success: true });
        } catch (err) {
            db.close();
            console.error("Erro em adicionarProdutosPedido:", err);
            reject(err);
        }
    });
}

