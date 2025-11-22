import { ipcMain } from "electron";
import { criarTelaCadastroProduto } from '../../screens/cadastro/produtoWindow.js';
import { cadastrarProduto, getProdutosID } from '../../models/cadastro/produto.js';

export function produtoController() {
  
  ipcMain.handle("get-produtos-por-categoria", async (_, idCategoria) => {
      return await getProdutosID(idCategoria);
    });

    ipcMain.handle("cadastrarProduto", async (_, nome, preco, categoria_id, descricao) => {
      return await cadastrarProduto(nome, preco, categoria_id, descricao);
    });

    ipcMain.handle("abrirCadastroProduto", async () => {
      await criarTelaCadastroProduto();
    });

};