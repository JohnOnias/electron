const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    login: (email, senha) => ipcRenderer.invoke("login-auth", email, senha)
  
});
