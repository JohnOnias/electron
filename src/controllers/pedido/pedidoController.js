import { ipcMain } from 'electron';
import { criarTelaPedido } from '../../screens/pedido/pedidoWindow.js';
import { getFuncionario } from '../../models/utils/getFuncionario.js';

export function pedidoController() {
    ipcMain.handle('abrirTelaPedido', async () => {
        try {
            await criarTelaPedido();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('getFuncionario', async (event, tipoFuncionario) => {
        return getFuncionario(tipoFuncionario);
    });
}
