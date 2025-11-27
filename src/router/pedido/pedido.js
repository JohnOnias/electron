const { contextBridge, ipcRenderer } = require('electron');


try {
    const api = {
            registrarPedido: (numeroMesa) => ipcRenderer.invoke('registrarPedido', numeroMesa ),
            getMesas: () => ipcRenderer.invoke('get-mesas'),
            getFuncionario: (tipoFuncionario) => ipcRenderer.invoke('getFuncionario', tipoFuncionario),
            getCurrentUser: () => ipcRenderer.invoke('get-current-user'),
            abrirTelaPedido: () => ipcRenderer.invoke('abrirTelaPedido'),
            setCurrentUser: (usuario) => ipcRenderer.invoke('set-current-user', usuario)

    }

     contextBridge.exposeInMainWorld('api', api);
    console.log('[preload-pedido] API exposta com sucesso - keys:', Object.keys(api));
    
}catch{
    console.error('[preload-pedido] ERRO ao carregar preload:', err);
}

        



       
   