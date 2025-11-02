const btnCategoria = document.getElementById('enviarCategoria');
const formCategoria = document.getElementById('formCadastroCategoria');

btnCategoria.addEventListener("click", async (e) => {
    e.preventDefault();

    const nomeCategoria = document.getElementById('nomeCategoria').value.trim();
    const status = document.getElementById('statusCategoria').value;

    if (!nomeCategoria || !status) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    // envia para o main.js
    const resultado = await window.api.cadastrarCategoria(nomeCategoria, status);

    if (resultado === true) {
        alert("Categoria cadastrada com sucesso!");
        formCategoria.reset();
    } else {
        alert("Erro ao cadastrar: " + resultado.error);
    }
});
