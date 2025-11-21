const { ipcRenderer, contextBridge } = require('electron');


contextBridge.exposeInMainWorld('api', {
        getCategorias: () => ipcRenderer.invoke('get-categorias'),
        cadastrarProduto: (nome, preco, categoria, descricao) => ipcRenderer.invoke('cadastrarProduto', nome, preco, categoria, descricao),
        abrirCadastroProduto: () => ipcRenderer.invoke('abrirCadastroProduto'),
        getProdutosPorCategoria: (idCategoria) => ipcRenderer.invoke('get-produtos-por-categoria', idCategoria)

});
       

