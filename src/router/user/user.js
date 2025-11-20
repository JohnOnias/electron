const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // User
    setCurrentUser: (usuario) => ipcRenderer.invoke('set-current-user', usuario),
    getCurrentUser: () => ipcRenderer.invoke('get-current-user')
});