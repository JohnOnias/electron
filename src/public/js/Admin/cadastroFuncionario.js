
const bnt = document.getElementById('enviar');
const form = document.getElementById('formCadastro')

bnt.addEventListener("click", async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const tipoFuncionario = document.getElementById('tipoFuncionario').value;
    console.log(nome, cpf, email, senha, tipoFuncionario);

    if(senha !== confirmarSenha){
        msg.textContent = "As senhas não conferem!";
        return;
    }

    // envia para main.js para inserir no banco
    const resultado = await window.api.cadastrarFuncionario(nome, cpf, email, senha, tipoFuncionario);
    
    if(resultado){
     alert("Funcionário cadastrado com sucesso!");
        form.reset();
    } else {
        alert("Erro: " + resultado.error);
    }
});
