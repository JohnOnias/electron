const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    login: (email, senha) => ipcRenderer.invoke("login-auth", email, senha), 
    chamarReset: ( emailRedefinir) => ipcRenderer.invoke("chamar-redefinir", emailRedefinir),
     abrirRedefinir: () => ipcRenderer.invoke('abrirRedefinir'),
    fecharRedefinir: () => ipcRenderer.invoke('recharRedefinir')



});


