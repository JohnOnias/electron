const btn = document.querySelector('#entrar');

btn.addEventListener("click", async (event) => {
    event.preventDefault(); 
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const usuario = await window.api.login(email, senha);

        console.log('Resposta do main:', usuario);
        
        if (usuario) {
            alert('Login bem-sucedido!');
            
            
            if (usuario.tipo === "adm") {
                // Abre tela de cadastro
                //const resultado = await window.api.abrirTelaDeCadastroFuncionario();
                const resultado = await window.api.abrirTelaAdm(); 
                console.log('Resultado:', resultado);
                
                if (resultado.success) {
                    // Fecha a tela de login apenas se a tela de cadastro foi aberta com sucesso
                    await window.api.fecharLogin();
                }
            }

             else if (usuario.tipo === "gerente") {
                // quando Jotinha terminar o painel chamar aqui
                console.log('Abrir painel do gerente');
            } else {
                // chamar o painel de garçom
                console.log('Abrir painel do garçom');
            }
        

        } else {
            alert('Email ou senha incorretos');
        }

    } catch (error) {
        console.error('Erro ao chamar login:', error);
        alert('Erro no login: ' + error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const esqueciAsenha = document.getElementById('esqueci');
    esqueciAsenha.addEventListener('click', () => {
        window.api.abrirReset(); 
    });
});