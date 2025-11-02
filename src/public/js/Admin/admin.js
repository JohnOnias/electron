
const { ipcRenderer } = require('electron');

document.getElementById('btnCadastrarFuncionario').addEventListener('click', async () => {
    ipcRenderer.invoke('abrirCadastroFuncionario');
});
