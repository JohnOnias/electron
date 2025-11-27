
import {conn } from '../../database/db/conn.js';

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


export async function getMesas(){
    const db = await conn();
  return new Promise((resolve, reject) => {
    db.all("SELECT id, numero, status, n_cadeiras FROM tb_Mesas order by numero", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows); 
    });
  })};

export async function verificarMesa(numero_mesa) {
  console.log("entrei no verificar mesa!"); 
  const db = await conn();
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM tb_Mesas WHERE numero = ?`;
    db.all(query, [numero_mesa], (err, row) => {
      if (err) {
        console.error("Erro ao verificar mesa:", err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}