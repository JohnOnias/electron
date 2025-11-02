const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    // Login e autenticação
    login: (email, senha) => ipcRenderer.invoke("login-auth", email, senha),

    // Redefinir senha
    chamarReset: (emailResetTest) => ipcRenderer.invoke("chamar-redefinir", emailResetTest),
    abrirReset: () => ipcRenderer.invoke('abrirResetTela'),
    fecharReset: () => ipcRenderer.invoke('fecharResetTela'),
    gerarToken: (email) => ipcRenderer.invoke("gerar-token", email),
    gerarEEnviarToken: (email) => ipcRenderer.invoke("gerar-e-enviar-token", email),
    validarToken: (token) => ipcRenderer.invoke("validar-token", token),
    resetarSenha: (token, novaSenha) => ipcRenderer.invoke("resetar-senha", token, novaSenha),
    abrirTelaDeVerificacaoToken: () => ipcRenderer.invoke("abrirTelaDeVerificacaoToken"),

    // Funcionario
    cadastrarFuncionario: (nome, cpf, email, cargo, senha) =>
        ipcRenderer.invoke("cadastrar-funcionario", nome, cpf, email, cargo, senha),
    abrirTelaDeCadastroFuncionario: () => ipcRenderer.invoke("abrirCadastroFuncionario"),

    // Categoria
    cadastrarCategoria: (nomeCategoria, status) =>
        ipcRenderer.invoke("cadastrar-categoria", nomeCategoria, status),
    abrirCadastroCategoria: () => ipcRenderer.invoke("abrirCadastroCategoria"),

    // Gerente
    abrirTelaGerente: () => ipcRenderer.invoke("abrirTelaGerente")
});


