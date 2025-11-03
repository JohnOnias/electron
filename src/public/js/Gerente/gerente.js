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