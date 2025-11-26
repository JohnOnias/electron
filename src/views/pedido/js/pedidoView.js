
document.addEventListener('DOMContentLoaded', async () => {  // <-- async aqui
    const bntAbrirPedido = document.getElementById('confirmar'); 
    const bntCancelar = document.getElementById('cancelar');
    const select = document.getElementById('ListaGarcom');
    const tipoFuncionario = "garcom"; 

   try {
        
        const garcons = await window.api.getFuncionario(tipoFuncionario);
        await window.api.getFuncionario("garcom").then(console.log)
        console.log("printando array:"); 
        console.log(garcons); 

        if (Array.isArray(garcons) && garcons.length > 0) {
            garcons.forEach(g => {
                const option = document.createElement("option");
                option.value = g.id;
                option.textContent = g.nome;
                select.appendChild(option);
            });
        }
    } catch(err){
        console.log('Não foi possível listar os Garçons', err);
    }

    if(bntAbrirPedido){
        bntAbrirPedido.addEventListener('click', () => {
            try {
                // Aqui você pode abrir o pedido usando Pedidos class
            } catch(err){
                alert("Erro: " + err); 
            }
        });
    }

});
