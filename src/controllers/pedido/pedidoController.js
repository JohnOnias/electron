import { ipcMain } from 'electron';
import { criarTelaPedido, fecharTelaPedido, criarTelaSelecaoProdutos, fecharTelaSelecaoProdutos, criarTelaEditarProdutos } from '../../screens/pedido/pedidoWindow.js';
import { getFuncionario } from '../../models/utils/getFuncionario.js';
import { registrarPedido} from '../../models/utils/registrarPedido.js'; 
import { mudarStatus } from '../../models/cadastro/mesa.js';
import { getProdutosID, getTodosProdutos, adicionarProdutosPedido } from '../../models/utils/produto.js';
import { getCategoria } from '../../models/cadastro/categoria.js';
import { inicializarTabelas } from '../../database/db/inicializador.js';

let pedidoAtual = {
    numeroMesa: null,
    idGarcom: null,
    idPedido: null
};

export function pedidoController() {

    // Abrir a tela de pedido
    ipcMain.handle('abrirTelaPedido', async () => {
        try {
            await criarTelaPedido();
            return { success: true };
        } catch (error) {
            console.error("Erro ao abrir tela de pedido:", error);
            return { success: false, error: error.message };
        }
    });

    // Pegar funcionários pelo tipo
    ipcMain.handle('getFuncionario', async (event, tipoFuncionario) => {
            return await getFuncionario(tipoFuncionario); 
    });

    // Registrar pedido com verificação de erros
    ipcMain.handle('registrarPedido', async (event, numeroMesa, idGarcom) => {
        try {
            const resultado = await registrarPedido(numeroMesa, idGarcom);
            // Armazenar dados do pedido atual
            pedidoAtual.numeroMesa = numeroMesa;
            pedidoAtual.idGarcom = idGarcom;
            pedidoAtual.idPedido = resultado.id;
            
            return { success: true, data: resultado };
        } catch (err) {
            console.error("Erro ao registrar pedido:", err);
            return { success: false, error: err.message };
        }
    });

    // Mudar status da mesa
    ipcMain.handle('mudar-status-mesa', async (event, numeroMesa) => {
        try {
            const resultado = await mudarStatus(numeroMesa);
            return { success: true, data: resultado };
        } catch (err) {
            console.error("Erro ao mudar status da mesa:", err);
            return { success: false, error: err.message };
        }
    });
    ipcMain.handle("abrir-editar-produtos", async () =>{
        criarTelaEditarProdutos(); 

    })

    ipcMain.handle("fecharTelaPedido", async () => {
        fecharTelaPedido();
        return { success: true };
    });

    // Abrir tela de seleção de produtos
    ipcMain.handle('abrirTelaSelecaoProdutos', async () => {
        try {
            // Inicializar tabelas do banco de dados
            await inicializarTabelas();
            
            await criarTelaSelecaoProdutos();
            return { success: true };
        } catch (error) {
            console.error("Erro ao abrir tela de seleção:", error);
            return { success: false, error: error.message };
        }
    });

    // Fechar tela de seleção de produtos
    ipcMain.handle('fecharTelaSelecaoProdutos', async () => {
        fecharTelaSelecaoProdutos();
        return { success: true };
    });

    // Pegar dados do pedido atual
    ipcMain.handle('getDadosPedidoAtual', async () => {
        return pedidoAtual;
    });

    // Pegar todas as categorias
    ipcMain.handle('getTodasCategorias', async () => {
        try {
            return await getCategoria();
        } catch (error) {
            console.error("Erro ao pegar categorias:", error);
            return [];
        }
    });

    // Pegar produtos de uma categoria
    ipcMain.handle('getProdutosCategoria', async (event, categoriaId) => {
        try {
            return await getProdutosID(categoriaId);
        } catch (error) {
            console.error("Erro ao pegar produtos:", error);
            return [];
        }
    });

    // Pegar todos os produtos
    ipcMain.handle('getTodosProdutos', async () => {
        try {
            return await getTodosProdutos();
        } catch (error) {
            console.error("Erro ao pegar produtos:", error);
            return [];
        }
    });

    // Adicionar produtos ao pedido
    ipcMain.handle('adicionarProdutosPedido', async (event, pedido) => {
        try {
            const resultado = await adicionarProdutosPedido(pedidoAtual.idPedido, pedido.produtos);
            return { success: true, data: resultado };
        } catch (err) {
            console.error("Erro ao adicionar produtos:", err);
            return { success: false, error: err.message };
        }
    });
}

