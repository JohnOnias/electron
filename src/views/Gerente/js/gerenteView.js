

document.addEventListener('DOMContentLoaded', () => {
    // Seletores (verifica existência antes de usar)
    const btnCadastrarCategoria = document.getElementById('btnCadastrarCategoria');
    const bntCadastrarProduto = document.getElementById('bntCadastrarProduto');
    const btnAdicionarMesa = document.getElementById('btnAdicionarMesa');
    const bntAbrirPedido = document.getElementById('bntAbrirPedido');
    //const btnPedidos = document.getElementById('btnPedidos');
    const btnMesas = document.getElementById('btnMesas');
    const btnCategorias = document.getElementById('btnCategorias');
    const btnCadastros = document.getElementById('btnCadastros');

    if (btnMesas) btnMesas.addEventListener('click', () => window.showScreens && window.showScreens('Mesas'));
    if (btnCategorias) btnCategorias.addEventListener('click', () => window.showScreens && window.showScreens('Categorias'));
    if (btnCadastros) btnCadastros.addEventListener('click', () => window.showScreens && window.showScreens('Cadastros'));
    if (btnCadastrarCategoria) btnCadastrarCategoria.addEventListener('click', async () => {
        try { await window.api.abrirCadastroCategoria(); } catch (err) { console.error(err); }
    });
    if (btnAdicionarMesa) btnAdicionarMesa.addEventListener('click', async () => {
        try { await window.api.abrirCadastroMesa(); } catch (err) { console.error(err); }
    });
    if (bntCadastrarProduto) bntCadastrarProduto.addEventListener('click', async () =>{
        try { await window.api.abrirCadastroProduto(); } catch (err) { console.error(err); }
    });
    if(bntAbrirPedido) bntAbrirPedido.addEventListener('click', async () => { try{ await window.api.abrirTelaPedido();} catch(err) {console.error(err)}})
   
   
    window.addEventListener("mesa-clicada", (e) => {
      console.log("EVENTO RECEBIDO NO PRELOAD:", e.detail);
      window.api.abrirTelaSelecaoProdutos();
      

      //window.api.abrirTelaPedido();
    });
    // tentar obter o usuário atual via IPC e mostrar tela inicial
 
});