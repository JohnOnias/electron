window.addEventListener('DOMContentLoaded', () =>{
    
alert('script funcionando!');

const btnCadastrarFuncionario = document.getElementById('btnCadastrar');
const btnCadastros = document.getElementById('btnCadastros');
const btnInicial = document.getElementById('#btnInicial');

if(btnCadastros) btnCadastros.addEventListener('click', () => window.showScreens && window.showScreens('Cadastros'));
if(btnInicial)btnInicial.addEventListener('click', () => window.showScreens && window.showScreens('Inicial'));

btnCadastrarFuncionario.addEventListener("click", async () => {
try {
     await window.api.abrirTelaDeCadastroFuncionario(); 
    
} catch (error) {

    console.log('erro ao abri a tela de cadastro gerente ', error); 
    
}
   

})

});