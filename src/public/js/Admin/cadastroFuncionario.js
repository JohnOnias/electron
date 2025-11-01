
const { ipcRenderer } = require('electron');

const form = document.getElementById('formCadastro');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const tipoFuncionario = document.getElementById('tipoFuncionario').value;

    if(senha !== confirmarSenha){
        msg.textContent = "As senhas não conferem!";
        return;
    }

    // envia para main.js para inserir no banco
    const resultado = await ipcRenderer.invoke('cadastrar-funcionario', { nome, cpf, email, senha, tipoFuncionario });
    
    if(resultado.success){
        msg.textContent = "Funcionário cadastrado com sucesso!";
        form.reset();
    } else {
        msg.textContent = "Erro: " + resultado.error;
    }
});
