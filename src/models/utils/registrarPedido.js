import { conn } from '../../database/db/conn.js';
import { verificarMesa, verificarMesaPedido, mudarStatus } from "../../models/cadastro/mesa.js";

export async function registrarPedido(numeroMesa, idGarcom) {
    console.log("Entrou no registrarPedido, mesa:", numeroMesa, idGarcom);

    const db = await conn();

    try {
        const verificar = await verificarMesa(numeroMesa);

        if (!verificar || verificar.length === 0) {
            throw new Error("Numeração de mesa não cadastrada!");
        }

        if (verificar[0].status.toLowerCase() === "ocupada") {
            throw new Error("Mesa já ocupada.");
        }

        const verificarPedido = await verificarMesaPedido(numeroMesa);
        if (verificarPedido && verificarPedido.length > 0) {
            throw new Error("Mesa já tem um pedido.");
        }

        // Muda o status da mesa para Ocupada
        await mudarStatus(numeroMesa);

        // Inserir pedido
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO tb_Pedidos (mesa_numero, status, id_funcionario) VALUES (?, ?, ?)`;
            db.run(query, [numeroMesa, "Aberto", idGarcom], function(err) {
                db.close();
                if (err) {
                    console.error("Erro ao registrar pedido:", err);
                    return reject(err);
                }
                resolve({ success: true, id: this.lastID });
            });
        });

    } catch (err) {
        console.error("Erro no registrarPedido:", err);
        throw err;
    }
}
