const btnCadastrarCategoria = document.getElementById('btnCadastrarCategoria');
const bntCadastrarProduto = document.getElementById('bntCadastrarProduto');

btnCadastrarCategoria.addEventListener('click', async () => {
    await window.api.abrirCadastroCategoria();
});


bntCadastrarProduto.addEventListener('click', async () =>{
    await window.api.abrirCadastroProduto(); 
});

// O nome do usuário será obtido via IPC do main process (setado no fluxo de login)
// Buscamos o usuário quando a janela termina de carregar (veja listener no final)
async function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => tela.style.display = "none");

    const tela = document.getElementById("tela" + id);
    tela.style.display = "block";

// printar as mesas na tela de mesas
    const mesas = await window.api.getMesas(); 
    const container = document.getElementById('mesas-container');

    container.innerHTML = "";

    mesas.forEach(m => {
        const card = document.createElement('div');
        card.classList.add('mesa-card');

       if(m.numero <10){
        m.numero = "0"+m.numero; 
       }
        card.innerHTML = `
            <div class="mesa-numero">${m.numero}</div>
            <span 
                 class="status-badge ${m.status === "disponivel" ? "disponivel" : "ocupada"}">
                ${m.status}
            </span>
        `;

        card.onclick = () => visualizarPedidos(m.numero);

        container.appendChild(card);
    });



    // printar as categorias 
    const categorias = await window.api.getCategorias(); 
    const containerCategorias = document.getElementById('produtos-container');

    containerCategorias.innerHTML = "";

    categorias.forEach(c => {
        const card = document.createElement('div');
        card.classList.add('mesa-card');
       
        card.innerHTML = `
            <div class="mesa-numero">${c.nome}</div>
            <span
                    class="status-badge ${c.status === "Ativa" ? "disponivel" : "ocupada"}">
                ${c.status}
            </span>
        `;

        card.onclick = () => visualizarProdutos(id);

        containerCategorias.appendChild(card);
    });





}

window.addEventListener('DOMContentLoaded', async () => {
    // tentar obter o usuário atual via IPC
    try {
        const usuario = await window.api.getCurrentUser();
        if (usuario && usuario.nome) {
            const el = document.getElementById("nomeFuncionario");
            if (el) el.innerText = usuario.nome;
        } else {
            const el = document.getElementById("nomeFuncionario");
            if (el) el.innerText = "Nome não disponível";
        }
    } catch (err) {
        console.warn('Erro ao obter usuário atual:', err);
        const el = document.getElementById("nomeFuncionario");
        if (el) el.innerText = "Nome não disponível";
    }

    mostrarTela('Mesas');
});