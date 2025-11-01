
async function enviar() {
    
    const emailRedefinir = document.getElementById("email")
    try {

        const redefinir = await window.api.chamarReset(emailRedefinir);
        console.log('Resposta do main:', redefinir);

        if (redefinir.length > 0) {
            alert('Token enviado para seu email: ' + JSON.stringify(redefinir[0]));
        } else {
            alert('Email incorreto ou usuario não existente');
        }

    } catch (error) {
        console.error('Erro ao chamar login:', error);
        alert('Erro no login: ' + error);
    }
}

