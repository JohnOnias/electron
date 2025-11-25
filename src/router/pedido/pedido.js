const { contextBridge, ipcRenderer } = require('electron');

try {
    const api = {
                registrarPedido: () => ipcRenderer.invoke('registrarPedido' ),
                getFuncionario: () => ipcRenderer.invoke('getFuncionario', tipo)
        
    };

    contextBridge.exposeInMainWorld('api', api);
    console.log('[preload-gerente] API exposta com sucesso - keys:', Object.keys(api));
} catch (err) {
    console.error('[preload-gerente] ERRO ao carregar preload:', err);
    // Expõe um stub mínimo para evitar crashes
    contextBridge.exposeInMainWorld('api', {
        getCurrentUser: () => ipcRenderer.invoke('get-current-user'),
        setCurrentUser: (usuario) => ipcRenderer.invoke('set-current-user', usuario)
    });
}