// ============================================================
// Imports principais
// ============================================================
import { app, BrowserWindow, ipcMain, nativeTheme, session } from "electron";
import sqlite3pkg from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const sqlite3 = sqlite3pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saltRounds = 10;


// ============================================================
// Variáveis Globais
// ============================================================
let loginWindow = null;
let resetWindow = null;
let tokenWindow = null;
let adm = null;
let VerificacaoToken = null;
let currentUser = null;


// ============================================================
// Imports internos
// ============================================================

// cadastro
import { criarTelaCadastroFuncionario, cadastrarFuncionario } from '../models/cadastro/cadastroFuncionario.js';
import { criarTelaCadastroProduto, cadastrarProduto } from '../models/cadastro/cadastroProduto.js';
import { criarTelaCadastroCategoria, cadastrarCategoria } from "../models/cadastro/categoria.js";
import { getMesas, cadastrarMesa } from "../models/cadastro/mesa.js";

// gets
import { getProdutosID } from "../models/cadastro/cadastroProduto.js";
import { getCategoria } from "../models/cadastro/categoria.js";

// login
import { login } from '../models/login/login.js';
//import { setCurrentUser, getCurrentUser } from '../models/login/currentUser.js';
import { criarTelaLogin } from '../screens/login/loginWindow.js';

// gerente / adm
import { criarTelaGerente } from "../screens/gerente/gerenteWindow.js";
import { admWindow } from "../screens/adm/admWindow.js";

// reset
import { criarTelaVerificacaoToken } from "../screens/reset/tokenWindow.js";
import { criarTelaReset } from "../screens/reset/resetWindow.js";
import { salvarToken, enviarTokenEmail, validarToken} from "../models/reset/token.js";


// verificaçãoes 

import { verificarMesa } from "../models/cadastro/mesa.js";
import crypto from "crypto";
import {verificarEmail} from "../models/reset/resetFunctions.js";
import nodemailer from "nodemailer";
import {atualizarSenha} from "../models/reset/resetFunctions.js";



// ============================================================
// Inicialização do App
// ============================================================
app.whenReady().then(() => {
  criarTelaLogin();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


// ============================================================
// IPC ROUTES
// ============================================================

// ------------------------ LOGIN -----------------------------
ipcMain.handle("login", async (_, email, senha) => {
  return await login(email, senha);
});

ipcMain.handle("set-current-user", async (_, usuario) => {
  currentUser = usuario || null;
  return { success: true };
});

ipcMain.handle("get-current-user", async () => currentUser);

ipcMain.handle("fecharLogin", async () => {
  if (loginWindow && !loginWindow.isDestroyed()) {
    loginWindow.close();
    loginWindow = null;
    return { success: true };
  }
  return { success: false, message: "Janela de login não encontrada" };
});


// ------------------------ FUNCIONÁRIOS ------------------------
ipcMain.handle("cadastrar-funcionario", async (_, nome, cpf, email, senha, tipo) => {
  return await cadastrarFuncionario(nome, cpf, email, senha, tipo);
});

ipcMain.handle("abrirCadastroFuncionario", async () => {
  await criarTelaCadastroFuncionario();
});


// ------------------------ PRODUTOS ----------------------------
ipcMain.handle("abrirCadastroProduto", async () => {
  await criarTelaCadastroProduto();
});

ipcMain.handle("cadastrarProduto", async (_, nome, preco, categoria_id, descricao) => {
  return await cadastrarProduto(nome, preco, categoria_id, descricao);
});

ipcMain.handle("get-produtos-por-categoria", async (_, idCategoria) => {
  return await getProdutosID(idCategoria);
});


// ------------------------ CATEGORIAS --------------------------
ipcMain.handle("abrirCadastroCategoria", async () => {
  return await criarTelaCadastroCategoria();
});

ipcMain.handle("cadastrar-categoria", async (_, nomeCategoria, status) => {
  return await cadastrarCategoria(nomeCategoria, status);
});

ipcMain.handle("get-categorias", async () => {
  return await getCategoria();
});


// ------------------------ MESAS -------------------------------
ipcMain.handle("abrirCadastroMesa", async () => {
  await criarTelaCadastroMesa();
});

ipcMain.handle("cadastro-mesa", async (_, numero_mesa, status, n_cadeiras) => {
  return await cadastrarMesa(numero_mesa, status, n_cadeiras);
});

ipcMain.handle("get-mesas", async () => {
  return await getMesas();
});


// ------------------------ RESET DE SENHA ----------------------
ipcMain.handle("abrirResetTela", async () => {
  if (!resetWindow) await criarTelaReset();
});

ipcMain.handle("fecharResetTela", async () => {
  if (resetWindow) {
    resetWindow.close();
    resetWindow = null;
  }
});

ipcMain.handle("chamar-redefinir", async (_, email) => {
  return await verificarEmail(email);
});

ipcMain.handle("abrirTelaDeVerificacaoToken", async () => {
  if (!VerificacaoToken) {
    await criarTelaVerificacaoToken();
    return { success: true };
  }
  return { success: false, message: "Tela já aberta" };
});

ipcMain.handle("gerar-token", async (_, email) => {
  return await salvarToken(email);
});

ipcMain.handle("gerar-e-enviar-token", async (_, email) => {
  const resultado = await salvarToken(email);
  if (!resultado) return null;

  try {
    await enviarTokenEmail(email, resultado.token);
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
});

ipcMain.handle("validar-token", async (_, token) => {
  return (await validarToken(token)) ? true : false;
});

ipcMain.handle("resetar-senha", async (_, token, novaSenha) => {
  return await atualizarSenha(token, novaSenha);
});


// ------------------------ TELAS -------------------------------
ipcMain.handle("abrirTelaGerente", async () => {
  try {
    await criarTelaGerente();
    if (loginWindow && !loginWindow.isDestroyed()) loginWindow.close();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("abrirTelaAdm", async () => {
  try {
    await admWindow();
    if (loginWindow && !loginWindow.isDestroyed()) loginWindow.close();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
