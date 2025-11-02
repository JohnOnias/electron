const { ipcRenderer } = require('electron');

document.getElementById('btnCadastrarCategoria').addEventListener('click', () => {
    window.api.abrirCadastroCategoria();
});

document.getElementById('btnCadastrarFuncionario').addEventListener('click', () => {
    window.api.abrirTelaDeCadastroFuncionario();

});
