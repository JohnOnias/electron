

document.addEventListener('DOMContentLoaded', () => {
    // Seletores (verifica existência antes de usar)
    const btnCadastrarCategoria = document.getElementById('btnCadastrarCategoria');
    const bntCadastrarProduto = document.getElementById('bntCadastrarProduto');
    const btnAdicionarMesa = document.getElementById('btnAdicionarMesa');
    const btnMesas = document.getElementById('btnMesas');
    const btnCategorias = document.getElementById('btnCategorias');
    const btnCadastros = document.getElementById('btnCadastros');

    if (btnMesas) btnMesas.addEventListener('click', () => window.showScreens && window.showScreens('Mesas'));
    if (btnCategorias) btnCategorias.addEventListener('click', () => window.showScreens && window.showScreens('Categorias'));
    if (btnCadastros) btnCadastros.addEventListener('click', () => window.showScreens && window.showScreens('Cadastros'));

    if (btnCadastrarCategoria) btnCadastrarCategoria.addEventListener('click', async () => {
        try { await window.api.abrirCadastroCategoria(); } catch (err) { console.error(err); }
    });
    if (btnAdicionarMesa) btnAdicionarMesa.addEventListener('click', async () => {
        try { await window.api.abrirCadastroMesa(); } catch (err) { console.error(err); }
    });
    if (bntCadastrarProduto) bntCadastrarProduto.addEventListener('click', async () =>{
        try { await window.api.abrirCadastroProduto(); } catch (err) { console.error(err); }
    });

    // tentar obter o usuário atual via IPC e mostrar tela inicial
    (async () => {
        try {
            const usuario = await window.api.getCurrentUser();
            const el = document.getElementById('nomeFuncionario');
            if (el) el.innerText = (usuario && usuario.nome) ? usuario.nome : 'Nome não disponível';
        } catch (err) {
            console.warn('Erro ao obter usuário atual:', err);
            const el = document.getElementById('nomeFuncionario');
            if (el) el.innerText = 'Nome não disponível';
        }

        if (window.showScreens) {
            try { window.showScreens('Mesas'); } catch (err) { console.error('Erro em showScreens:', err); }
        }
    })();
});