

export async function verificarMesa(db, numero_mesa) {
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