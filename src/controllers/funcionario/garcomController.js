import { ipcMain } from 'electron';
import { criarTelaGarcom } from '../../screens/garcom/garcomWindow.js';
import { getLoginWindow } from '../../screens/login/loginWindow.js';

const loginWindow = getLoginWindow();

export function garcomController() {
    ipcMain.handle('abrirTelaGarcom', async () => {
        try {
            await criarTelaGarcom();

            if (loginWindow && !loginWindow.isDestroyed()) loginWindow.close();

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });


}
