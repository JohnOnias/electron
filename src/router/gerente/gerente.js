const { contextBridge, ipcRenderer } = require('electron');
// testar 
console.log('[preload-gerente] iniciando...');

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
        abrirTelaPedido: () => ipcRenderer.invoke('abrirTelaPedido'),
        // Produto API
        cadastrarProduto: (nome, preco, categoria, descricao) => ipcRenderer.invoke('cadastrarProduto', nome, preco, categoria, descricao),
        abrirCadastroProduto: () => ipcRenderer.invoke('abrirCadastroProduto'),
        getProdutosPorCategoria: (idCategoria) => ipcRenderer.invoke('get-produtos-por-categoria', idCategoria),

        // User
        getCurrentUser: () => ipcRenderer.invoke('get-current-user'),
        setCurrentUser: (usuario) => ipcRenderer.invoke('set-current-user', usuario)
        
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