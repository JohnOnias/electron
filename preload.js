const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    // Login e autenticação
    login: (email, senha) => ipcRenderer.invoke("login", email, senha),

    // Redefinir senha
    fecharLogin: () => ipcRenderer.invoke('fecharLogin'),
    chamarReset: (emailResetTest) => ipcRenderer.invoke("chamar-redefinir", emailResetTest),
    abrirReset: () => ipcRenderer.invoke('abrirResetTela'),
    fecharReset: () => ipcRenderer.invoke('fecharResetTela'),
    gerarToken: (email) => ipcRenderer.invoke("gerar-token", email),
    gerarEEnviarToken: (email) => ipcRenderer.invoke("gerar-e-enviar-token", email),
    validarToken: (token) => ipcRenderer.invoke("validar-token", token),
    resetarSenha: (token, novaSenha) => ipcRenderer.invoke("resetar-senha", token, novaSenha),
    abrirTelaDeVerificacaoToken: () => ipcRenderer.invoke("abrirTelaDeVerificacaoToken"),

    // Adm
    cadastrarFuncionario: (nome, cpf, email, cargo, senha) =>
        ipcRenderer.invoke("cadastrar-funcionario", nome, cpf, email, cargo, senha),
    abrirTelaDeCadastroFuncionario: () => ipcRenderer.invoke("abrirCadastroFuncionario"),
    abrirTelaAdm: () => ipcRenderer.invoke("abrirTelaAdm")
   ,

    // Categoria
    cadastrarCategoria: (nomeCategoria, status) => ipcRenderer.invoke("cadastrar-categoria", nomeCategoria, status),
    abrirCadastroCategoria: () => ipcRenderer.invoke("abrirCadastroCategoria"),
    getCategorias: () => ipcRenderer.invoke("get-categorias"),

    // Gerente
    abrirTelaGerente: () => ipcRenderer.invoke("abrirTelaGerente"),
    abrirCadastroProduto: () => ipcRenderer.invoke("abrirCadastroProduto"),

    // Current user (set after login, read from other windows)
    setCurrentUser: (usuario) => ipcRenderer.invoke('set-current-user', usuario),
    getCurrentUser: () => ipcRenderer.invoke('get-current-user'),


    cadastrarProduto: (nome, preco, categoria, descricao) => ipcRenderer.invoke("cadastrarProduto", nome, preco, categoria, descricao),
    getMesas: () => ipcRenderer.invoke("get-mesas"),
    getProdutosPorCategoria: (idCategoria) => ipcRenderer.invoke("get-produtos-por-categoria", idCategoria)



});


