
import {conn } from '../../database/db/conn.js';
import{ verificarMesa} from "../../models/cadastro/mesa.js"

export async function registrarPedido(numeroMesa) {
    console.log("entrei no registro Pedido!");
    const db = await conn(); 

    try {
        const verificar = await verificarMesa(numeroMesa);
        if (verificar.status === "ocupada") {
            throw new Error("Mesa já ocupada."); // Throw an error if the table is occupied
        }
    } catch (err) {
        console.log(`Erro: ${err.message}`); 
        throw err; // Propagate the error
    }

    return new Promise((resolve, reject) => {
        const query = `INSERT INTO tb_Pedidos (mesa_id, status) VALUES (?, ?)`;
        db.all(query, [numeroMesa, "Aberto"], (err, rows) => {
            db.close();
            if (err) {
                console.error(`Erro ao abrir pedido: ${err}`);
                reject(err);
                return;
            }
            resolve(rows); // Return the result
        });
    });
}
