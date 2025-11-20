const { ipcRenderer } = require('electron');

module.exports = {
    mesaAPI: {
        getMesas: () => ipcRenderer.invoke('get-mesas'),
        abrirCadastroMesa: () => ipcRenderer.invoke('abrirCadastroMesa'),
        cadastrarMesa: (numero_mesa, status, n_cadeiras) => ipcRenderer.invoke('cadastro-mesa', numero_mesa, status, n_cadeiras)
    }
};