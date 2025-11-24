import { ipcMain } from 'electron';
import { criarTelaPedido } from '../../screens/pedido/pedidoWindow.js';


export function pedidoController() {
    ipcMain.handle('abrirTelaPedido', async () => {
        try {
            await criarTelaPedido();

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });


}
