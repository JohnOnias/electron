const btn = document.querySelector('#enviar');

btn.addEventListener("click", async () => {
    const email = document.getElementById("emailResetTest").value.trim();
    if (!email) return alert("Digite o e-mail");

    try {
        const res = await window.api.gerarEEnviarToken(email);
        if (res && res.sucesso) {
            alert("Token enviado para seu e-mail! Verifique a caixa de entrada.");
            // abre a tela de reset
            await window.api.abrirTelaDeVerificacaoToken();
        } else {
            alert("Erro ao enviar token: " + (res.erro || "E-mail não encontrado"));
        }
    } catch (err) {
        console.error(err);
        alert("Erro inesperado ao enviar token");
    }
});
