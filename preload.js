const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    login: (email, senha) => ipcRenderer.invoke("login-auth", email, senha), 
    chamarReset: ( emailRedefinir) => ipcRenderer.invoke("chamar-redefinir", emailRedefinir),
     abrirRedefinir: () => ipcRenderer.invoke('abrirRedefinir'),
    fecharRedefinir: () => ipcRenderer.invoke('recharRedefinir')
});

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  cadastrarFuncionario: (nome, cpf, email, cargo, senha) =>
    ipcRenderer.invoke("cadastrar-funcionario", nome, cpf, email, cargo, senha)
});

