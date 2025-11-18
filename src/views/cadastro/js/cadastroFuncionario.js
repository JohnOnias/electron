const form = document.getElementById('formCadastro');
const campoCPF = document.getElementById('cpf');

// Máscara de CPF automática e robusta
campoCPF.addEventListener('input', function () {
    let valor = this.value.replace(/\D/g, ""); // remove tudo que não é número

    if (valor.length > 11) valor = valor.slice(0, 11);

    // Aplica máscara
    if (valor.length > 9) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (valor.length > 6) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (valor.length > 3) {
        valor = valor.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    this.value = valor;
});


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const tipoFuncionario = document.getElementById('tipoFuncionario').value;

    // Validação do HTML5
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Validação manual
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
