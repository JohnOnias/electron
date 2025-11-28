import { ipcMain } from 'electron';
import { criarTelaPedido, fecharTelaPedido } from '../../screens/pedido/pedidoWindow.js';
import { getFuncionario } from '../../models/utils/getFuncionario.js';
import { registrarPedido} from '../../models/utils/registrarPedido.js'; 
import { mudarStatus } from '../../models/cadastro/mesa.js';

export function pedidoController() {

    // Abrir a tela de pedido
    ipcMain.handle('abrirTelaPedido', async () => {
        try {
            await criarTelaPedido();
            return { success: true };
        } catch (error) {
            console.error("Erro ao abrir tela de pedido:", error);
            return { success: false, error: error.message };
        }
    });

    // Pegar funcionários pelo tipo
    ipcMain.handle('getFuncionario', async (event, tipoFuncionario) => {
        
            return await getFuncionario(tipoFuncionario); 
     
    });

    // Registrar pedido com verificação de erros
    ipcMain.handle('registrarPedido', async (event, numeroMesa, idGarcom) => {
        try {
            const resultado = await registrarPedido(numeroMesa, idGarcom);
            return { success: true, data: resultado };
        } catch (err) {
            console.error("Erro ao registrar pedido:", err);
            return { success: false, error: err.message };
        }
    });

    // Mudar status da mesa
    ipcMain.handle('mudar-status-mesa', async (event, numeroMesa) => {
        try {
            const resultado = await mudarStatus(numeroMesa);
            return { success: true, data: resultado };
        } catch (err) {
            console.error("Erro ao mudar status da mesa:", err);
            return { success: false, error: err.message };
        }
    });
    ipcMain.handle("fecharTelaPedido", async () => {
    fecharTelaPedido();
    return { success: true };
});
}
