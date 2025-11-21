window.addEventListener("DOMContentLoaded", () => {

    const btnAdicionarMesa = document.getElementById('cadastrarMesa');
    
    btnAdicionarMesa.addEventListener('click', async (event) => {
        event.preventDefault();

        const numero_mesa = document.getElementById('numero_mesa').value;
        const status = document.getElementById('status_mesa').value;
        const n_cadeiras = document.getElementById('n_cadeiras').value;
        if (!numero_mesa || !status || !n_cadeiras) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            const resultado = await window.api.cadastrarMesa(numero_mesa, status, n_cadeiras);
            if (resultado.success) {
                alert("Mesa cadastrada com sucesso!");
            } else {
            throw new Error("Mesa já cadastrada");
            }
        } catch (error) {
            alert("Erro ao cadastrar mesa: " + error.message);
            console.error("Erro ao cadastrar mesa:", error);
        }
    });

});