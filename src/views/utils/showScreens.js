window.showScreens = async function (id) {
    document.querySelectorAll(".tela").forEach(tela => tela.style.display = "none");
    
    const tela = document.getElementById("tela" + id);
    if (!tela) return;
    tela.style.display = "block";

    try {
        const mesas = (window.api && window.api.getMesas) ? await window.api.getMesas() : [];
        
        const container = document.getElementById('mesas-container');
        if (container) {
            container.innerHTML = "";

            mesas.forEach(m => {
                const card = document.createElement('div');
                card.classList.add('mesa-card');

                const numeroFormatado = (m.numero < 10) ? `0${m.numero}` : m.numero;
                card.innerHTML = `
                    <div class="mesa-numero">${numeroFormatado}</div>
                    <span class="status-badge ${m.status === "Disponivel" ? "disponivel" : "ocupada"}">
                        ${m.status}
                    </span>
                `; 

               card.addEventListener("click", async () => {
                        console.log("evento disparado enviado");

                        const dados = {
                            numero: m.numero,
                            status: m.status
                        };

                        const evento = new CustomEvent("mesa-clicada", {
                            detail: dados,
                            bubbles: true
                        });

                        window.dispatchEvent(evento);
                        console.log(evento); 
                        console.log("click na mesa! " + m.numero);
                        
            });
            container.appendChild(card);

                
            });
        }
    } catch (err) {
        console.warn('Erro carregando mesas:', err);
    }

    // printar as categorias 
    try {
        const categorias = (window.api && window.api.getCategorias) ? await window.api.getCategorias() : [];
        const containerCategorias = document.getElementById('categorias-container');
        if (containerCategorias) {
            containerCategorias.innerHTML = "";

            categorias.forEach(c => {
                const card = document.createElement('div');
                card.classList.add('mesa-card');

                card.innerHTML = `
                    <div class="mesa-numero">${c.nome}</div>
                    <span class="status-badge ${c.status === "Ativa" ? "disponivel" : "ocupada"}">
                        ${c.status}
                    </span>
                `;

                card.onclick = () => {
                    if (window.visualizarProdutos) return window.visualizarProdutos(c.id, c.nome, c.status);
                    console.log('Categoria clicada:', c.id);
                };

                containerCategorias.appendChild(card);
            });
        }
    } catch (err) {
        console.warn('Erro carregando categorias:', err);
    }
};


