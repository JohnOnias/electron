const { contextBridge, ipcRenderer } = require('electron');


try {
    const api = {
            registrarPedido: () => ipcRenderer.invoke('registrarPedido' ),
                getFuncionario: (tipoFuncionario) => ipcRenderer.invoke('getFuncionario', tipoFuncionario),
                getCurrentUser: () => ipcRenderer.invoke('get-current-user'),
                setCurrentUser: (usuario) => ipcRenderer.invoke('set-current-user', usuario)

    }

     contextBridge.exposeInMainWorld('api', api);
    console.log('[preload-pedido] API exposta com sucesso - keys:', Object.keys(api));
    
}catch{
    console.error('[preload-pedido] ERRO ao carregar preload:', err);
}

        
            


       
   