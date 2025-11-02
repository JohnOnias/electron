const btnCadastrarFuncionario = document.querySelector('#btnCadastrar');


btnCadastrarFuncionario.addEventListener("click", async() => {

    await window.api.abrirTelaDeCadastroFuncionario(); 

})

