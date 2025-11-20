const { contextBridge, ipcRenderer } = require('electron');

try {
    const api = {
        // Categoria API
        getCategorias: () => ipcRenderer.invoke('get-categorias'),
        cadastrarCategoria: (nomeCategoria, status) => ipcRenderer.invoke('cadastrar-categoria', nomeCategoria, status),
        abrirCadastroCategoria: () => ipcRenderer.invoke('abrirCadastroCategoria'),

        // Mesa API
        getMesas: () => ipcRenderer.invoke('get-mesas'),
        cadastrarMesa: (numero_mesa, status, n_cadeiras) => ipcRenderer.invoke('cadastro-mesa', numero_mesa, status, n_cadeiras),
        abrirCadastroMesa: () => ipcRenderer.invoke('abrirCadastroMesa'),

        // Produto API
        cadastrarProduto: (nome, preco, categoria, descricao) => ipcRenderer.invoke('cadastrarProduto', nome, preco, categoria, descricao),
        abrirCadastroProduto: () => ipcRenderer.invoke('abrirCadastroProduto'),
        getProdutosPorCategoria: (idCategoria) => ipcRenderer.invoke('get-produtos-por-categoria', idCategoria),

        // User
        getCurrentUser: () => ipcRenderer.invoke('get-current-user'),
        setCurrentUser: (usuario) => ipcRenderer.invoke('set-current-user', usuario)
    };

    contextBridge.exposeInMainWorld('api', api);
    try { console.log('[preload-gerente] exposed api keys:', Object.keys(api)); } catch (e) { console.log('[preload-gerente] exposed api (could not list keys)', e); }
} catch (err) {
    console.error('[preload-gerente] error during preload execution:', err);
    throw err;
}
