const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    
    getMesas: () => ipcRenderer.invoke("get-mesas"),
    abrirCadastroMesa: () => ipcRenderer.invoke("abrirCadastroMesa"),
    cadastrarMesa: (numero_mesa, status, n_cadeiras) => ipcRenderer.invoke("cadastro-mesa", numero_mesa, status, n_cadeiras)
  

  

});