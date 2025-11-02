const btn = document.querySelector('#entrar');

btn.addEventListener("click", async () => {

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const usuario = await window.api.login(email, senha);

        console.log('Resposta do main:', usuario);
        
        if (usuario) {
            alert('Login bem-sucedido!');

        } else {
            alert('Email ou senha incorretos');
        }

    } catch (error) {
        console.error('Erro ao chamar login:', error);
        alert('Erro no login: ' + error);
    }
    if(usuario.tipo === "adm"){

        await window.api.abrirTelaDeCadastroFuncionario();

    }
    if(usuario.tipo === "gerente"){
         // quando Jotinha terminar o painel chamar aqui
    }
    else{

        // chamar o painel de garçom

    }

});
document.addEventListener('DOMContentLoaded', () =>{
    const esqueciAsenha = document.getElementById('esqueci');
    esqueciAsenha.addEventListener('click', () => {
        window.api.abrirReset(); 
    })
});



