const { ipcRenderer } = require('electron');

module.exports = {
    categoriaAPI: {
        getCategorias: () => ipcRenderer.invoke('get-categorias'),
        cadastrarCategoria: (nomeCategoria, status) => ipcRenderer.invoke('cadastrar-categoria', nomeCategoria, status),
        abrirCadastroCategoria: () => ipcRenderer.invoke('abrirCadastroCategoria')
    }
};
