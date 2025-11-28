import { conn } from './conn.js';

export async function inicializarTabelas() {
    const db = await conn();
    
    return new Promise((resolve, reject) => {
        // Criar tabela tb_Itens_Pedidos se não existir
        const query = `
            CREATE TABLE IF NOT EXISTS tb_Itens_Pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pedido_id INTEGER NOT NULL,
                produto_id INTEGER NOT NULL,
                quantidade INTEGER NOT NULL,
                preco_unitario DECIMAL(10, 2) NOT NULL,
                data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (pedido_id) REFERENCES tb_Pedidos(id),
                FOREIGN KEY (produto_id) REFERENCES tb_Produtos(id)
            )
        `;

        db.run(query, (err) => {
            db.close();
            if (err) {
                console.error("Erro ao criar tabela tb_Itens_Pedidos:", err);
                reject(err);
            } else {
                console.log("Tabela tb_Itens_Pedidos criada com sucesso ou já existe!");
                resolve(true);
            }
        });
    });
}
