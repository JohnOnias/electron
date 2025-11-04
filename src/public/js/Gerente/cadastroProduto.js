window.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("categoria");
  const btn = document.getElementById('enviar');
  const formCategoria = document.getElementById('formCadastro');

  if (!select) console.error("Elemento 'categoria' não encontrado no DOM.");

  // Carrega categorias com tratamento de erros
  try {
    const categorias = await window.api.getCategorias();
    if (Array.isArray(categorias)) {
      categorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.nome;
        select.appendChild(option);
      });
    } else {
      console.warn("getCategorias retornou um valor inesperado:", categorias);
    }
  } catch (err) {
    console.error("Erro ao carregar categorias:", err);
  }

  if (!btn) {
    console.error("Botão 'enviar' não encontrado no DOM.");
    return;
  }

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const nomeEl = document.getElementById('nome');
    const precoEl = document.getElementById('preco');
    const categoriaEl = document.getElementById('categoria');
    const descricaoEl = document.getElementById('descricao');

    const nome = nomeEl?.value?.trim();
    const precoStr = precoEl?.value?.trim();
    const categoria = categoriaEl?.value;
    const descricao = descricaoEl?.value?.trim();

    if (!nome || !categoria || !precoStr || !descricao) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const preco = parseFloat(precoStr.replace(',', '.'));
    if (Number.isNaN(preco)) {
      alert("Preço inválido.");
      return;
    }

    let resultado;
    try {
      resultado = await window.api.cadastrarProduto(nome, preco, categoria, descricao);
      console.log("cadastrarProduto resultado:", resultado);
    } catch (err) {
      console.error("Erro ao chamar cadastrarProduto:", err);
      alert("Erro ao cadastrar: " + (err && err.message ? err.message : "erro desconhecido"));
      return;
    }

    if (resultado === true) {
      alert("Produto cadastrado com sucesso!");
      if (formCategoria) formCategoria.reset();
    } else if (resultado && typeof resultado === 'object' && resultado.error) {
      alert("Erro ao cadastrar: " + resultado.error);
    } else {
      console.error("Resposta inesperada de cadastrarProduto:", resultado);
      alert("Erro ao cadastrar: resposta inesperada (ver console)");
    }
  });
});
