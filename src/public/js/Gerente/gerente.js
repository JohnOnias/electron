// Função para visualizar pedidos de uma mesa
function visualizarPedidos(numeroMesa) {
    alert(`Visualizando pedidos da Mesa ${numeroMesa.toString().padStart(2, '0')}`);
    // Aqui você pode adicionar a lógica para mostrar os pedidos da mesa
    // Por exemplo, abrir um modal ou redirecionar para outra página
}

// Inicializar a tela de Mesas ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    mostrarTela('Mesas');
});


// Função para mostrar a tela selecionada



function mostrarTela(nomeTela) {
    // Esconder todas as telas
    const telas = document.querySelectorAll('.tela');
    telas.forEach(tela => {
        tela.style.display = 'none';
    });
    
    // Remover classe active de todos os links
    const links = document.querySelectorAll('.menu a');
    links.forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar a tela selecionada
    if (nomeTela === 'Mesas') {
        document.getElementById('telaMesas').style.display = 'block';
        links[0].classList.add('active');
    } else if (nomeTela === 'Produtos') {
        document.getElementById('telaProdutos').style.display = 'block';
        links[1].classList.add('active');
    } else if (nomeTela === 'Cadastros') {
        document.getElementById('telaCadastros').style.display = 'block';
        links[2].classList.add('active');
    }
}


const mesas = await window.api.getMesas(); 

mesas.forEach(m => {
  // pega o modelo (template oculto)
  let modelo = document.getElementById('divClone'); 
  
  // cria uma cópia
  let clone = modelo.cloneNode(true);

  // atualiza o conteúdo do clone
  clone.innerHTML = `
    <div class="mesa-card" onclick="visualizarPedidos(${m.numero})">
      <div class="mesa-numero">${m.numero}</div>
      <span class="status-badge disponivel">${m.status}</span>
    </div>
  `;

  // exibe e adiciona no container
  clone.style.display = 'block';
  document.getElementById('telaMesas').append(clone);
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