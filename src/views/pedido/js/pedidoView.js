import { Pedidos } from "../../utils/PedidosClass";     

document.addEventListener('DOMContentLoaded', () => {
    const bntAbrirPedido = document.getElementById('confirmar'); 
    const bntCancelar = document.getElementById('cancelar');
    const bntSelectGarcom = document.getElementById('ListGarcom');
    const inputMesaNumero = document.getElementById('mesa');


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




