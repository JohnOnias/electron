const btn = document.querySelector('#entrar');

btn.addEventListener("click", async () => {

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const usuario = await window.api.login(email, senha);

        console.log('Resposta do main:', usuario);
        
        if (usuario.length > 0) {
            alert('Login bem-sucedido: ' + JSON.stringify(usuario[0]));
        } else {
            alert('Email ou senha incorretos');
        }

    } catch (error) {
        console.error('Erro ao chamar login:', error);
        alert('Erro no login: ' + error);
    }
});


document.addEventListener('DOMContentLoaded', () =>{
    const esqueciAsenha = document.getElementById('esqueci');

    esqueciAsenha.addEventListener('click', () => {
        window.api.abrirRedefinir(); 
    })

})

