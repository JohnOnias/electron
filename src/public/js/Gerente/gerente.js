
// Função para mostrar a tela selecionada
const btnCadastrarCategoria = document.getElementById('btnCadastrarCategoria');
const bntCadastrarProduto = document.getElementById('bntCadastrarProduto');




btnCadastrarCategoria.addEventListener('click',  async () => {

            await window.api.abrirCadastroCategoria();


        });

bntCadastrarProduto.addEventListener('click', async () =>{

     await window.api.abrirCadastroProduto(); 
})

function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => tela.style.display = "none");
    document.getElementById("tela" + id).style.display = "block";
}




// #####################################################

const mesas = await window.api.getMesas(); 

const container = document.getElementById('telaMesas');

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













// ########################### funçoes não escritas ###############################################################



function visualizarPedidos(numeroMesa) {
    alert(`Visualizando pedidos da Mesa ${numeroMesa.toString().padStart(2, '0')}`);
    // Aqui você pode adicionar a lógica para mostrar os pedidos da mesa
    // Por exemplo, abrir um modal ou redirecionar para outra página
}

// Inicializar a tela de Mesas ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    mostrarTela('Mesas');
});

// Função para ver categoria de produtos
function verCategoria(nomeCategoria) {
    alert(`Visualizando produtos da categoria: ${nomeCategoria.charAt(0).toUpperCase() + nomeCategoria.slice(1)}`);
    // Aqui você pode adicionar a lógica para mostrar os produtos da categoria
    // Por exemplo, abrir um modal ou redirecionar para outra página
}

// Inicializar a tela de Mesas ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    mostrarTela('Mesas');
});