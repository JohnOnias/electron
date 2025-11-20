import { ipcMain } from "electron";
import { login } from '../../models/login/login.js';
import { getLoginWindow } from '../../screens/login/loginWindow.js';
export const loginWindow = getLoginWindow();
export function loginController() {
       
    ipcMain.handle("login", async (_, email, senha) => {
        return await login(email, senha);
    });

    ipcMain.handle("fecharLogin", async () => {
        try {
            if (loginWindow && !loginWindow.isDestroyed()) {
                loginWindow.close();
                return { success: true };
            }
            return { success: false, message: "Janela de login não encontrada" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    });
};
