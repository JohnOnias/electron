let pedido = {
    numeroMesa: null,
    idGarcom: null,
    produtos: [] // Array com {id, nome, preco, quantidade}
};

let categoriaSelecionada = '';
let produtosDisponiveis = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Recuperar dados do pedido passados da janela anterior
        const dadosPedido = await window.api.getDadosPedidoAtual();
        if (dadosPedido) {
            pedido.numeroMesa = dadosPedido.numeroMesa;
            pedido.idGarcom = dadosPedido.idGarcom;
        }

        // Carregar categorias
        await carregarCategorias();

        // Carregar produtos
        await carregarProdutos();

        // Configurar event listeners
        configurarEventListeners();

    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar produtos: " + error.message);
    }
});

async function carregarCategorias() {
    try {
        const categorias = await window.api.getTodasCategorias();
        const selectCategoria = document.getElementById('categoria-select');

        if (Array.isArray(categorias) && categorias.length > 0) {
            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.nome;
                selectCategoria.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

async function carregarProdutos(categoriaId = null) {
    try {
        let produtos;
        
        if (categoriaId) {
            // Carregar produtos de uma categoria específica
            produtos = await window.api.getProdutosCategoria(categoriaId);
        } else {
            // Carregar todos os produtos
            produtos = await window.api.getTodosProdutos();
        }

        produtosDisponiveis = produtos || [];
        renderizarProdutos(produtosDisponiveis);
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

function renderizarProdutos(produtos) {
    const produtosLista = document.getElementById('produtos-lista');
    
    if (!produtos || produtos.length === 0) {
        produtosLista.innerHTML = '<p class="mensagem-vazia">Nenhum produto disponível</p>';
        return;
    }

    produtosLista.innerHTML = '';

    produtos.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto-item';
        div.id = `produto-${produto.id}`;

        const precoFormatado = parseFloat(produto.preco).toFixed(2);

        div.innerHTML = `
            <div class="produto-info">
                <div class="produto-nome">${produto.nome}</div>
                <div class="produto-descricao">${produto.descricao || 'Sem descrição'}</div>
                <div class="produto-preco">R$ ${precoFormatado}</div>
            </div>
            <div class="produto-controls">
                <input type="number" class="quantidade-input" min="1" value="1" data-produto-id="${produto.id}" data-produto-nome="${produto.nome}" data-produto-preco="${produto.preco}">
                <button class="btn-adicionar" data-produto-id="${produto.id}" data-produto-nome="${produto.nome}" data-produto-preco="${produto.preco}">Adicionar</button>
            </div>
        `;

        produtosLista.appendChild(div);

        // Adicionar event listener ao botão
        const btnAdicionar = div.querySelector('.btn-adicionar');
        btnAdicionar.addEventListener('click', () => {
            adicionarAoPedido(produto.id, produto.nome, produto.preco);
        });
    });
}

function adicionarAoPedido(produtoId, produtoNome, precoProduto) {
    const quantidadeInput = document.querySelector(`input[data-produto-id="${produtoId}"]`);
    const quantidade = parseInt(quantidadeInput.value, 10);

    if (quantidade <= 0) {
        alert("Quantidade deve ser maior que 0");
        return;
    }

    // Verificar se o produto já existe no pedido
    const produtoExistente = pedido.produtos.find(p => p.id === produtoId);

    if (produtoExistente) {
        produtoExistente.quantidade += quantidade;
    } else {
        pedido.produtos.push({
            id: produtoId,
            nome: produtoNome,
            preco: precoProduto,
            quantidade: quantidade
        });
    }

    quantidadeInput.value = 1; // Resetar a quantidade
    atualizarCarrinho();
    alert(`${produtoNome} adicionado ao pedido!`);
}

function atualizarCarrinho() {
    const carrinhoItems = document.getElementById('carrinho-items');
    const totalPreco = document.getElementById('total-preco');

    if (pedido.produtos.length === 0) {
        carrinhoItems.innerHTML = '<p class="mensagem-vazia">Nenhum produto selecionado</p>';
        totalPreco.textContent = '0.00';
        return;
    }

    carrinhoItems.innerHTML = '';
    let total = 0;

    pedido.produtos.forEach((produto, index) => {
        const subtotal = produto.preco * produto.quantidade;
        total += subtotal;

        const div = document.createElement('div');
        div.className = 'carrinho-item';
        div.id = `carrinho-${produto.id}`;

        div.innerHTML = `
            <div class="carrinho-item-info">
                <div class="carrinho-item-nome">${produto.nome}</div>
                <div class="carrinho-item-detalhes">Qtd: ${produto.quantidade} | Preço Unit: R$ ${parseFloat(produto.preco).toFixed(2)}</div>
            </div>
            <div class="carrinho-item-subtotal">R$ ${subtotal.toFixed(2)}</div>
            <button class="btn-remover" data-produto-id="${produto.id}">Remover</button>
        `;

        carrinhoItems.appendChild(div);

        // Adicionar event listener ao botão remover
        const btnRemover = div.querySelector('.btn-remover');
        btnRemover.addEventListener('click', () => {
            removerDoPedido(produto.id);
        });
    });

    totalPreco.textContent = total.toFixed(2);
}

function removerDoPedido(produtoId) {
    pedido.produtos = pedido.produtos.filter(p => p.id !== produtoId);
    atualizarCarrinho();
}

function configurarEventListeners() {
    const categoriaSelect = document.getElementById('categoria-select');
    const btnVoltar = document.getElementById('voltar');
    const btnFinalizar = document.getElementById('finalizar');

    categoriaSelect.addEventListener('change', async (e) => {
        const categoriaId = e.target.value;
        await carregarProdutos(categoriaId || null);
    });

    btnVoltar.addEventListener('click', () => {
        window.api.fecharTelaSelecaoProdutos();
    });

    btnFinalizar.addEventListener('click', async () => {
        if (pedido.produtos.length === 0) {
            alert("Por favor, selecione pelo menos um produto!");
            return;
        }

        try {
            console.log("Enviando pedido:", pedido);
            const resultado = await window.api.adicionarProdutosPedido(pedido);
            if (resultado.success) {
                alert("Produtos adicionados ao pedido com sucesso!");
                window.api.fecharTelaSelecaoProdutos();
            } else {
                alert("Erro ao adicionar produtos: " + resultado.error);
            }
        } catch (error) {
            console.error("Erro ao finalizar pedido:", error);
            alert("Erro: " + error.message);
        }
    });
}
