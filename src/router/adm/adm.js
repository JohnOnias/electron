const {contextBridge, ipcRenderer} = require("electron");
contextBridge.exposeInMainWorld("api", {
    // adm
     abrirTelaAdm: () => ipcRenderer.invoke("abrirTelaAdm")
});
