import { ipcMain } from 'electron';
import { criarTelaGerente } from '../../screens/gerente/gerenteWindow.js';
import { getLoginWindow } from '../../screens/login/loginWindow.js';

import { 
    getTodosPedidos, 
    getDetalhesPedido, 
    removerProdutoPedido, 
    fecharPedido,
    calcularTotalPedido 
} from '../../models/utils/pedido.js';

export function gerenteController() {
    
    // Evita registrar handlers duplicados caso o módulo seja recarregado
    if (ipcMain.listenerCount('abrirTelaGerente') === 0) {

        ipcMain.handle('abrirTelaGerente', async () => {
            try {
                await criarTelaGerente();

                const loginWindow = getLoginWindow();

                if (loginWindow && !loginWindow.isDestroyed()) {
                    loginWindow.close();
                }

                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        // ==================== HANDLERS DE PEDIDOS ====================

        // Buscar todos os pedidos
        ipcMain.handle('gerente-get-pedidos', async () => {
            try {
                const pedidos = await getTodosPedidos();
                return { success: true, data: pedidos };
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
                return { success: false, error: error.message };
            }
        });

        // Buscar detalhes de um pedido específico
        ipcMain.handle('gerente-get-detalhes-pedido', async (event, pedidoId) => {
            try {
                const detalhes = await getDetalhesPedido(pedidoId);
                const total = await calcularTotalPedido(pedidoId);
                return { success: true, data: { itens: detalhes, total } };
            } catch (error) {
                console.error("Erro ao buscar detalhes do pedido:", error);
                return { success: false, error: error.message };
            }
        });

        // Remover produto de um pedido
        ipcMain.handle('gerente-remover-produto-pedido', async (event, itemId) => {
            try {
                const resultado = await removerProdutoPedido(itemId);
                return { success: true, data: resultado };
            } catch (error) {
                console.error("Erro ao remover produto:", error);
                return { success: false, error: error.message };
            }
        });

        // Fechar pedido
        ipcMain.handle('gerente-fechar-pedido', async (event, pedidoId) => {
            try {
                const resultado = await fecharPedido(pedidoId);
                return { success: true, data: resultado };
            } catch (error) {
                console.error("Erro ao fechar pedido:", error);
                return { success: false, error: error.message };
            }
        });
    }
}
