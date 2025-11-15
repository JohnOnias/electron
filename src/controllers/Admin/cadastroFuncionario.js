const form = document.getElementById('formCadastro');
let campoCPF = document.getElementById('cpf');


campoCPF.addEventListener('keypress', function(e)  {
    let tamanhoCampo = e.target.value.length;
    if (tamanhoCampo == 3) {
        e.target.value += '.';
    }
    if (tamanhoCampo == 7) {
        e.target.value += '.';
    }
    if (tamanhoCampo == 11) {
        e.target.value += '-';
    }
    if (tamanhoCampo >= 14) {
        e.preventDefault();
    }
       
    
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const tipoFuncionario = document.getElementById('tipoFuncionario').value;


    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

 
    if (senha !== confirmarSenha) {
        alert("As senhas não conferem!");
        return;
    }

    
    try {
        const resultado = await window.api.cadastrarFuncionario(
            nome, cpf, email, senha, tipoFuncionario
        );

        if (resultado.success) {
            alert("Funcionário cadastrado com sucesso!");
            form.reset();
        } else {
            alert("Erro: " + resultado.error);
        }
    } catch (error) {
        alert("Erro ao cadastrar funcionário: " + error.message);
    }
});