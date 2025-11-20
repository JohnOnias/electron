let resultado = null; 
export let exportNome = null;
const btn = document.querySelector('#entrar');
const esqueciAsenha = document.getElementById('esqueci');




   
    btn.addEventListener("click", async (event) => {
            event.preventDefault(); 
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            if (!email || !senha) {
                alert('Por favor, preencha todos os campos.');
            }
            else{
            try {
                const usuario = await window.api.login(email, senha);
                exportNome = usuario && usuario.nome;

                try {
                    await window.api.setCurrentUser(usuario);
                } catch (err) {
                    console.warn('Não foi possível setar current user via IPC:', err);
                }
                console.log('Login retornou:', usuario);

                if (usuario) {
                    alert('Login bem-sucedido!');

                    if (usuario.tipo === "adm") {
                        resultado = await window.api.abrirTelaAdm(); 
                        if (resultado && resultado.success) await window.api.fecharLogin();
                    } else if (usuario.tipo === "gerente") {
                        resultado = await window.api.abrirTelaGerente(); 
                        if (resultado && resultado.success) await window.api.fecharLogin();
                    } else {
                        console.log('Abrir painel do garçom');
                    }

                } else {
                    alert('Email ou senha incorretos');
                }

            } catch (error) {
                console.error('Erro ao chamar login:', error);
                alert('Erro no login: ' + error);
            }
    }}    
);
   

 
    esqueciAsenha.addEventListener('click', () => {
         window.api.abrirReset(); 
    });
    


