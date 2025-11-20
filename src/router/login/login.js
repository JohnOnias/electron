// router/login/login.js
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld("api", {
    // Login
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



});