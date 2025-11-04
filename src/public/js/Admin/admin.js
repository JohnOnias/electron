const btnCadastrarFuncionario = document.querySelector('#btnCadastrar');


btnCadastrarFuncionario.addEventListener("click", async() => {

    await window.api.abrirTelaDeCadastroFuncionario(); 

})

function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => tela.style.display = "none");
    document.getElementById("tela" + id).style.display = "block";
}