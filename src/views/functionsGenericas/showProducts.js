export async function visualizarProdutos(id, nome, status) {
    // Oculta todas as telas
    document.querySelectorAll(".tela").forEach(tela => tela.style.display = "none");

    // Mostra a tela de produtos
    const telaProdutos = document.getElementById("telaProdutos");
    telaProdutos.style.display = "block";

    // Carrega os produtos
    const produtos = await window.api.getProdutosPorCategoria(id);
    const containerProdutos = document.getElementById('produtos-container');
    containerProdutos.innerHTML = "";
    document.getElementById('nomeCategoria').innerText = nome; ;

    
    produtos.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('product-item');

        if(status === "Inativa"){ 
            console.log("Categoria Inativa");
            card.classList.add('disabled');
             card.innerHTML = `
            <div class="product-info">
                <h3 class="product-name2">${p.nome}</h3>
                <p class="product-description">${p.descricao}</p>
            </div>
            <div class="product-controls">
                <div class="product-price">R$ ${p.preco.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-product="${p.id}">-</button>
                    <span class="quantity-display" id="${p.id}-qty">0</span>
                    <button class="quantity-btn plus" data-product="${p.id}">+</button>
                </div>
            </div>
        `;
        containerProdutos.appendChild(card);
        }

        else{
            console.log("Categoria Ativa");
            card.innerHTML = `
                <div class="product-info">
                    <h3 class="product-name">${p.nome}</h3>
                    <p class="product-description">${p.descricao}</p>
                </div>
                <div class="product-controls">
                    <div class="product-price">R$ ${p.preco.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-product="${p.id}">-</button>
                        <span class="quantity-display" id="${p.id}-qty">0</span>
                        <button class="quantity-btn plus" data-product="${p.id}">+</button>
                    </div>
                </div>
            `;
            containerProdutos.appendChild(card);
        }
    });
}