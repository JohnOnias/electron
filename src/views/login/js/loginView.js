let resultado = null;
window.exportNome = null;

document.addEventListener('DOMContentLoaded', () => {
   
    const btn = document.querySelector('#entrar');
    const esqueciAsenha = document.getElementById('esqueci');

    if (!btn) {
        console.error('Botão entrar não encontrado');
        return;
    }

    btn.addEventListener('click', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        if (!email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const usuario = await window.api.login(email, senha);
            window.exportNome = usuario && usuario.nome;

            try {
                await window.api.setCurrentUser(usuario);
            } catch (err) {
                console.warn('Não foi possível setar current user via IPC:', err);
            }
            console.log('Login retornou:', usuario);

            if (usuario) {
                alert('Login bem-sucedido!');

                if (usuario.tipo === 'adm') {
                    resultado = await window.api.abrirTelaAdm();
                    if (resultado && resultado.success) await window.api.fecharLogin();
                } else if (usuario.tipo === 'gerente') {
                    resultado = await window.api.abrirTelaGerente();
                    if (resultado && resultado.success) await window.api.fecharLogin();
                } else if (usuario.tipo === 'garçom') {
                    resultado = await window.api.abrirTelaGarcom();
                    if (resultado && resultado.success) await window.api.fecharLogin(); 
                }
                    
                

            } else {
                alert('Email ou senha incorretos');
            }

        } catch (error) {
            console.error('Erro ao chamar login:', error);
            alert('Erro no login: ' + error);
        }
    });

    if (esqueciAsenha) {
        esqueciAsenha.addEventListener('click', () => {
            window.api.abrirReset();
        });
    }
});
    


