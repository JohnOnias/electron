

const btn = document.getElementById("btnReset");

btn.addEventListener("click", async () => {
    const token = document.getElementById("token").value.trim();
    const novaSenha = document.getElementById("novaSenha").value.trim();

    if (!token || !novaSenha) return alert("Preencha todos os campos");

    // valida token
    const valido = await window.api.validarToken(token);
    if (!valido) return alert("Token inválido ou expirado");

    // atualiza senha
    const sucesso = await window.api.resetarSenha(token, novaSenha);
    if (sucesso) {
        alert("Senha redefinida com sucesso!");
        window.close(); // fecha a janela de reset
    } else {
        alert("Erro ao redefinir senha");
    }
});

