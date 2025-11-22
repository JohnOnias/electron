import { ipcMain } from "electron";
import { loginWindow } from '../login/loginController.js';
import { admWindow } from "../../screens/adm/admWindow.js";
import { criarTelaCadastroFuncionario } from "../../screens/cadastro/funcionarioWindow.js";
 

 export function admController() {

    ipcMain.handle("abrirTelaAdm", async () => {
        try {
            await admWindow();
            if (loginWindow && !loginWindow.isDestroyed()) loginWindow.close();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
        });
        


};