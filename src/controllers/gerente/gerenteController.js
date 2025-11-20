import { ipcMain } from "electron";
import { criarTelaGerente } from '../../screens/gerente/gerenteWindow.js';
import { getLoginWindow} from '../../screens/login/loginWindow.js';
//import{categoriaController} from '../../controllers/cadastro/cadastroController.js';



const loginWindow = getLoginWindow();

export function gerenteController() {
    ipcMain.handle("abrirTelaGerente", async () => {
        try {
            await criarTelaGerente();

            if (loginWindow && !loginWindow.isDestroyed()) loginWindow.close();

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
}
