let labelMesa, mesa, form;


document.addEventListener("mesa-clicada", (e) => {
    console.log("evento disparado recebido");

    if (!labelMesa || !mesa || !form) {
        console.warn("Elementos ainda não carregados");
        return;
    }

    labelMesa.style.display = "none";
    mesa.style.display = "none";

    const card = document.createElement('h2');
    card.innerHTML = `Numero da mesa: ${e.detail.numero}`;
    form.appendChild(card);
    window.api.bntAbrirPedido(); 
});


document.addEventListener('DOMContentLoaded', async () => {

    labelMesa = document.getElementById("labelMesa");
    mesa = document.getElementById("mesa"); 
    form = document.getElementById("formID");
    const bntAbrirPedido = document.getElementById("confirmar"); 
    const bntCancelar = document.getElementById("cancelar");
    const select = document.getElementById("ListaGarcom");
    const tipoFuncionario = "garcom"; 

document.addEventListener("input", async(e) => {
    if(mesa){
        if(mesa.value <= 0){
            e.preventDefault(); 
            alert("apenar numeros maiores que 0!");
            console.log("entrei na verificação maior que 0!"); 
        }
    }
});


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
if (bntAbrirPedido) {
    bntAbrirPedido.addEventListener('click', async (e) => {
        try {
            e.preventDefault();
            const numeroMesa = mesa.value;
            
            if (!numeroMesa) {
                alert("Por favor, informe o número da mesa.");
                return;
            }

            // Call the API to register the order
            await window.api.registrarPedido(numeroMesa);
            console.log(`Pedido registrado para a mesa: ${numeroMesa}`);
            console.log("Cliquei em confirmar pedido");
            
        } catch (err) {
            console.error("Erro ao registrar o pedido:", err);
            alert("Erro: " + err.message || err);
        }
    });
}

});
