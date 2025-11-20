import { ipcMain } from "electron";
let currentUser = null;


export function userController() {

    ipcMain.handle("set-current-user", async (_, usuario) => {
    currentUser = usuario || null;
    return { success: true };
    });

    ipcMain.handle("get-current-user", async () => currentUser);

};
