const btnCadastrarCategoria = document.getElementById('btnCadastrarCategoria');
const bntCadastrarProduto = document.getElementById('bntCadastrarProduto');

btnCadastrarCategoria.addEventListener('click', async () => {
    await window.api.abrirCadastroCategoria();
});


bntCadastrarProduto.addEventListener('click', async () =>{
    await window.api.abrirCadastroProduto(); 
});



async function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => tela.style.display = "none");

    const tela = document.getElementById("tela" + id);
    tela.style.display = "block";

    if (tela.id === "telaMesas") {
        await carregarMesas();
    }
}

async function carregarMesas() {
    const mesas = await window.api.getMesas(); 
    const container = document.getElementById('telaMesas');

    container.innerHTML = "";

    mesas.forEach(m => {
        const card = document.createElement('div');
        card.classList.add('mesa-card');

        card.innerHTML = `
        <div class="mesa-numero">${m.numero}</div>
        <span class="status-badge ${m.status === "Disponível" ? "disponivel" : "ocupada"}">
          ${m.status}
        </span>
      `;

        card.onclick = () => visualizarPedidos(m.numero);

        container.appendChild(card);
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    mostrarTela('Mesas');
});