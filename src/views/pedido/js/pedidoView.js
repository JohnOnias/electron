import { Pedidos } from "../../utils/PedidosClass";     

document.addEventListener('DOMContentLoaded', () => {
    const bntAbrirPedido = document.getElementById('confirmar'); 
    const bntCancelar = document.getElementById('cancelar');
    const bntSelectGarcom = document.getElementById('ListGarcom');
    const inputMesaNumero = document.getElementById('mesa');
    const select = document.getElementById('ListGarcom');


try {
    const garcons = await window.api.getGarcom();
    if (Array.isArray(garcons)) {
      garcons.forEach(g => {
        const option = document.createElement("option");
        option.value = g.id;
        option.textContent = g.nome;
        select.appendChild(option);
      });
    }
}
catch(err){
    
}






    if(bntAbrirPedido){
        bntAbrirPedido.addEventListener('click', () =>{
               try {

            }
        
               catch(err){
                alert("Erro: ", err); 
               }
        });
     

    }






}) 




