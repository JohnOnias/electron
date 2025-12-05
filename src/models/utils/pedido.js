import { conn } from "../../database/db/conn.js";
import { mudarStatusParaLivre } from "../cadastro/mesa.js";

/**
 * Buscar todos os pedidos com informações da mesa e funcionário
 */
export async function getTodosPedidos() {
  const db = await conn();

  const query = `
        SELECT 
            p.id,
            p.mesa_numero,
            p.status,
            p.id_funcionario,
            p.data_hora,
            f.nome as nome_funcionario,
            m.n_cadeiras
        FROM tb_Pedidos p
        LEFT JOIN tb_Funcionarios f ON p.id_funcionario = f.id
        LEFT JOIN tb_Mesas m ON p.mesa_numero = m.numero
        ORDER BY p.data_hora DESC
    `;

  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      db.close();
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

/**
 * Buscar detalhes de um pedido específico com seus itens
 */
export async function getDetalhesPedido(pedidoId) {
  const db = await conn();

  const query = `
        SELECT 
            ip.id,
            ip.pedido_id,
            ip.produto_id,
            ip.quantidade,
            ip.preco_unitario,
            p.nome as nome_produto,
            p.descricao
        FROM tb_Itens_Pedidos ip
        INNER JOIN tb_Produtos p ON ip.produto_id = p.id
        WHERE ip.pedido_id = ?
    `;

  return new Promise((resolve, reject) => {
    db.all(query, [pedidoId], (err, rows) => {
      db.close();
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

/**
 * Remover um produto específico de um pedido
 */
export async function removerProdutoPedido(itemId) {
  const db = await conn();

  const query = `DELETE FROM tb_Itens_Pedidos WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(query, [itemId], function (err) {
      db.close();
      if (err) return reject(err);
      resolve({ success: true, changes: this.changes });
    });
  });
}

/**
 * Fechar um pedido (mudar status para 'Fechado' e liberar mesa)
 */
export async function fecharPedido(pedidoId) {
  const db = await conn();

  try {
    // Buscar o pedido
    const pedido = await new Promise((resolve, reject) => {
      const query = `SELECT mesa_numero, status FROM tb_Pedidos WHERE id = ?`;
      db.get(query, [pedidoId], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    if (!pedido) {
      db.close();
      throw new Error("Pedido não encontrado");
    }

    if (pedido.status === "Fechado") {
      db.close();
      throw new Error("Pedido já está fechado");
    }

    // Atualizar status
    await new Promise((resolve, reject) => {
      const query = `UPDATE tb_Pedidos SET status = 'Fechado' WHERE id = ?`;
      db.run(query, [pedidoId], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });

    db.close();

    // Liberar mesa
    await mudarStatusParaLivre(pedido.mesa_numero);

    return {
      success: true,
      mesa_numero: pedido.mesa_numero,
    };
  } catch (err) {
    db.close();
    throw err;
  }
}

/**
 * Calcular total de um pedido
 */
export async function calcularTotalPedido(pedidoId) {
  const db = await conn();

  const query = `
        SELECT SUM(quantidade * preco_unitario) as total
        FROM tb_Itens_Pedidos
        WHERE pedido_id = ?
    `;

  return new Promise((resolve, reject) => {
    db.get(query, [pedidoId], (err, row) => {
      db.close();
      if (err) return reject(err);
      resolve(row?.total || 0);
    });
  });
}
