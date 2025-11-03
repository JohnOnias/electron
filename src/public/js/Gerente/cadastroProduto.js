const btn = document.getElementById('enviar'); 
const formCategoria = document.getElementById('formCadastro');

window.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("categoria");
  
  const categorias = await window.api.getCategorias();
  
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.nome;
    select.appendChild(option);
  });
});


btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value;
    const preco = document.getElementById('preco').value;
    const descricao = document.getElementById('descricao').value;

    if (!nome || !categoria || !preco || !descricao) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const resultado = await window.api.cadastrarProduto(nome, categoria, preco, descricao);

    if (resultado === true) {
        alert("Produto cadastrado com sucesso!");
        formCategoria.reset();
    } else {
        alert("Erro ao cadastrar: " + resultado.error);
    }
});
