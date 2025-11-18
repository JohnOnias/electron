const btnCadastrarCategoria = document.getElementById('btnCadastrarCategoria');
const bntCadastrarProduto = document.getElementById('bntCadastrarProduto');
const btnAdicionarMesa = document.getElementById('btnAdicionarMesa');
import { showScreens } from "./src/views/fuctionGenericas/showScreens.js";


showScreens(id);

// eventos dos botões
btnCadastrarCategoria.addEventListener('click', async () => {
    await window.api.abrirCadastroCategoria();
});
btnAdicionarMesa.addEventListener('click', async () => {
    await window.api.abrirCadastroMesa();
});

bntCadastrarProduto.addEventListener('click', async () =>{
    await window.api.abrirCadastroProduto(); 
});

// O nome do usuário será obtido via IPC do main process (setado no fluxo de login)
// Buscamos o usuário quando a janela termina de carregar (veja listener no final)

window.addEventListener('DOMContentLoaded', async () => {
    // tentar obter o usuário atual via IPC
    try {
        const usuario = await window.api.getCurrentUser();
        if (usuario && usuario.nome) {
            const el = document.getElementById("nomeFuncionario");
            if (el) el.innerText = usuario.nome;
        } else {
            const el = document.getElementById("nomeFuncionario");
            if (el) el.innerText = "Nome não disponível";
        }
    } catch (err) {
        console.warn('Erro ao obter usuário atual:', err);
        const el = document.getElementById("nomeFuncionario");
        if (el) el.innerText = "Nome não disponível";
    }

    mostrarTela('Mesas');
});

