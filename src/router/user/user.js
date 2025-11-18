import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
    // Login
    setCurrentUser: (usuario) => ipcRenderer.invoke('set-current-user', usuario),
    getCurrentUser: () => ipcRenderer.invoke('get-current-user'),
});