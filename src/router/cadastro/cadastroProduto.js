const { ipcRenderer } = require('electron');

module.exports = {
    produtoAPI: {
        cadastrarProduto: (nome, preco, categoria, descricao) => ipcRenderer.invoke('cadastrarProduto', nome, preco, categoria, descricao),
        abrirCadastroProduto: () => ipcRenderer.invoke('abrirCadastroProduto'),
        getProdutosPorCategoria: (idCategoria) => ipcRenderer.invoke('get-produtos-por-categoria', idCategoria)
    }
};