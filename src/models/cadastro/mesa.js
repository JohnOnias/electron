import { conn } from '../../database/db/conn.js';

console.log("models/mesa carregado!");

/* ============================================================
    CADASTRAR MESA
============================================================ */
export async function cadastrarMesa(numero_mesa, status, n_cadeiras) {
  const db = await conn();
  try {
    if (!numero_mesa) {
      throw new Error("Número da mesa é obrigatório.");
    }

    const existingMesa = await verificarMesa(numero_mesa);
    if (existingMesa.length > 0) {
      throw new Error("Mesa já cadastrada.");
    }

    await new Promise((resolve, reject) => {
      const query = `INSERT INTO tb_Mesas (numero, status, n_cadeiras) VALUES (?, ?, ?)`;
      db.run(query, [numero_mesa, status, n_cadeiras], function(err) {
        if (err) {
          console.error("Erro ao cadastrar mesa:", err);
          reject(err);
        } else {
          resolve(true);
        }
      });
    });

    return { success: true };
  } catch (err) {
    console.error(err.message);
    return { success: false, error: err.message };
  } finally {
    db.close();
  }
}

/* ============================================================
    LISTAR MESAS
============================================================ */
export async function getMesas() {
  const db = await conn();
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT id, numero, status, n_cadeiras FROM tb_Mesas ORDER BY numero",
      [],
      (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/* ============================================================
    VERIFICAR SE A MESA EXISTE
============================================================ */
export async function verificarMesa(numero_mesa) {
  console.log("verificarMesa()");
  const db = await conn();
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM tb_Mesas WHERE numero = ?`;
    db.all(query, [numero_mesa], (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/* ============================================================
    VERIFICAR SE A MESA ESTÁ EM PEDIDO ATIVO
============================================================ */
export async function verificarMesaPedido(numero_mesa) {
  console.log("verificarMesaPedido()");
  const db = await conn();
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM tb_Pedidos WHERE mesa_numero = ?`;
    db.all(query, [numero_mesa], (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/* ============================================================
    MUDAR STATUS PARA OCUPADA
============================================================ */
export async function mudarStatus(numero_mesa) {
  console.log("mudarStatus() → Ocupada");
  const db = await conn();

  return new Promise((resolve, reject) => {
    const query = `UPDATE tb_Mesas SET status = 'Ocupada' WHERE numero = ?`;
    db.run(query, [numero_mesa], function(err) {
      db.close();
      if (err) reject(err);
      else resolve({ success: true, changes: this.changes });
    });
  });
}

/* ============================================================
    ✔ FUNÇÃO QUE ESTAVA FALTANDO:
       mudarStatusParaLivre()
============================================================ */
export async function mudarStatusParaLivre(numero_mesa) {
  console.log("mudarStatusParaLivre() → Livre");

  const db = await conn();
  return new Promise((resolve, reject) => {
    const query = `UPDATE tb_Mesas SET status = 'Livre' WHERE numero = ?`;

    db.run(query, [numero_mesa], function(err) {
      db.close();
      if (err) {
        console.error("Erro ao liberar mesa:", err);
        reject(err);
      } else {
        resolve({ success: true, changes: this.changes });
      }
    });
  });
}