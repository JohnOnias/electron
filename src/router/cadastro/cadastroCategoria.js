const { ipcRenderer, contextBridge } = require('electron');

 
contextBridge.exposeInMainWorld('api', {

        getCategorias: () => ipcRenderer.invoke('get-categorias'),
        cadastrarCategoria: (nomeCategoria, status) => ipcRenderer.invoke('cadastrar-categoria', nomeCategoria, status),
        abrirCadastroCategoria: () => ipcRenderer.invoke('abrirCadastroCategoria')
    

});
        

