let labelMesa, mesa, form, select;

document.addEventListener('DOMContentLoaded', async () => {

    labelMesa = document.getElementById("labelMesa");
    mesa = document.getElementById("mesa");
    form = document.getElementById("formID");
    select = document.getElementById("ListaGarcom");
    const bntAbrirPedido = document.getElementById("confirmar");
    const bntCancelar = document.getElementById("cancelar"); 
    const tipoFuncionario = "garcom";


    mesa.addEventListener("input", () => {
        const valor = parseInt(mesa.value, 10);
        if (isNaN(valor) || valor <= 0) {
            alert("Apenas números maiores que 0!");
            mesa.value = "";
        }
    });

  
    try {
        const garcons = await window.api.getFuncionario(tipoFuncionario);
        if (Array.isArray(garcons) && garcons.length > 0) {
            garcons.forEach(g => {
                const option = document.createElement("option");
                option.value = g.id;
                option.textContent = g.nome;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error("Não foi possível listar os garçons:", err);
    }

    if (bntAbrirPedido) {
        bntAbrirPedido.addEventListener('click', async (e) => {
            e.preventDefault();
            const numeroMesa = parseInt(mesa.value, 10);
        

            if (!numeroMesa || numeroMesa <= 0) {
                alert("Por favor, informe um número de mesa válido (>0).");
                return;
            }

            try {
                const idGarcom = select.value; 
                const resposta = await window.api.registrarPedido(numeroMesa, idGarcom);
                console.log(select.value); 
                if (resposta.success) {
                    alert("Pedido registrado com sucesso!");
                    form.reset();
                } else {
                    alert("Erro ao registrar pedido: " + resposta.error);
                }

            } catch (err) {
                console.error("Erro ao registrar o pedido:", err);
                alert("Erro: " + (err.message || err));
            }
        });
    }
   if (bntCancelar) {
    bntCancelar.addEventListener("click", async (e) => {
        await window.api.fecharTelaPedido(); 
    });
}
});
