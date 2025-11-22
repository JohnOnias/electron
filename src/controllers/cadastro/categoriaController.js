import { ipcMain } from "electron";
import { criarTelaCadastroCategoria } from '../../screens/cadastro/categoriaWindow.js';
import { cadastrarCategoria, getCategoria } from '../../models/cadastro/categoria.js';


export function categoriaController() {

  ipcMain.handle("abrirCadastroCategoria", async () => {
    await criarTelaCadastroCategoria();
    return { success: true };
  });

  ipcMain.handle("cadastrar-categoria", async (_, nomeCategoria, status) => {
    return await cadastrarCategoria(nomeCategoria, status);
  });
  ipcMain.handle("get-categorias", async () => {
    return await getCategoria();
  });

};