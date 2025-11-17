import { app, BrowserWindow, ipcMain, nativeTheme, session } from "electron";
import sqlite3pkg from "sqlite3";
const sqlite3 = sqlite3pkg.verbose();

import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

// Necessário porque ES Modules NÃO possui __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saltRounds = 10;


//######################################################## variaveis globais ##################################################
let loginWindow = null; 
let resetWindow = null;
let tokenWindow = null;
let adm = null;  
let VerificacaoToken = null; 
let currentUser = null; // armazenar temporariamente o usuário logado



//################################ imports #######################################
import { criarTelaCadastroFuncionario } from './src/models/cadastro/cadastroFuncionario.js';
import { cadastrarFuncionario } from './src/models/cadastro/cadastroFuncionario.js';
import { cadastrarProduto } from './src/models/cadastro/cadastroProduto.js';
import { criarTelaCadastroProduto } from './src/models/cadastro/cadastroProduto.js';
import { login } from './src/models/login/login.js';
import { getProdutosID } from "./src/models/gets/produtos.js";
import { getMesas } from "./src/models/gets/mesas.js";
import { criarTelaGerente } from "./src/models/gerente/gerenteWindow.js";
import { criarTelaVerificacaoToken,  } from "./src/models/reset/tokenWindow.js";
import { criarTelaReset } from "./src/models/reset/resetWindow.js";






// aqui chama a janela principal quando se clica no app
app.whenReady().then(() => {
 


// so abre outra janela se todas estiverem fechadas (para MAC)
 app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// quando a janela for fechada encerra a aplicação (para WIN e Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});


// ######################################################### ROTAS #########################################################################


// login auth 
ipcMain.handle("login", async (event, email, senha) => {
   return await login(email, senha);
});

// Permitir que renderers definam/obtenham o usuário atual (setado no login)
ipcMain.handle('set-current-user', async (event, usuario) => {
  currentUser = usuario || null;
  return { success: true };
});

ipcMain.handle('get-current-user', async (event) => {
  return currentUser || null;
});

// fechar login sa desgraça 
ipcMain.handle("fecharLogin", async () => {
    if (loginWindow && !loginWindow.isDestroyed()) {
        loginWindow.close();
        loginWindow = null;
        return { success: true, message: 'Janela de login fechada' };
    }
    return { success: false, message: 'Janela de login não encontrada' };
});

// cadastrar funcionario
ipcMain.handle('cadastrar-funcionario', async (event, nome, cpf, email, senha, tipoFuncionario) => {
    return await cadastrarFuncionario(nome, cpf, email, senha, tipoFuncionario);
});
// abrir tela de reset
ipcMain.handle("abrirResetTela", async () => {
    if (!resetWindow) await criarTelaReset();
});
// fechar tela de reset
ipcMain.handle("fecharResetTela", async () => {
    if (resetWindow) {
        resetWindow.close();
        resetWindow = null;
    }
});
// chama o redefinir
ipcMain.handle("chamar-redefinir", async(event, emailResetTest) => {
   return await verificarEmail(emailResetTest);
});


// chama a tela de cadastro de categoria 
ipcMain.handle('abrirCadastroCategoria', async () => {
    return await criarTelaCadastroCategoria();
});

// abre a tela de verificação de token
ipcMain.handle("abrirTelaDeVerificacaoToken", async () => {
  if (!VerificacaoToken) {
    await criarTelaVerificacaoToken();
    return { success: true };
  }
  return { success: false, message: 'Tela já aberta' };
});

ipcMain.handle('cadastrar-categoria', async (event, nomeCategoria, status) => {
        return await cadastrarCategoria(nomeCategoria, status); 
});

ipcMain.handle('cadastrarProduto', async (event, nome, preco, categoria_id, descricao) => {
  return await cadastrarProduto(nome, preco, categoria_id, descricao);
});


// gera token de verificação
ipcMain.handle("gerar-token", async (event, email) => {
    const resultado = await salvarToken(email);
    if (resultado) {
        console.log("Token gerado para:", email);
    }
    return resultado; 
});

// enviar token por email
ipcMain.handle("gerar-e-enviar-token", async (event, email) => {
    const resultado = await salvarToken(email); // gera token e salva no DB
    if (!resultado) return null;

    try {
        await enviarTokenEmail(email, resultado.token);
        console.log("Token enviado para o e-mail:", email);
        return { sucesso: true };
    } catch (err) {
        console.error("Erro ao enviar e-mail:", err);
        return { sucesso: false, erro: err.message };
    }
});

// valida o token 
ipcMain.handle("validar-token", async (event, token) => {
    const usuario = await validarToken(token);
    return usuario ? true : false;
});

// atualiza a senha para a senha nova
ipcMain.handle("resetar-senha", async (event, token, novaSenha) => {
    const sucesso = await atualizarSenha(token, novaSenha);
    return sucesso;
});

// abrir tela de cadastro funcionario
ipcMain.handle("abrirCadastroFuncionario", async(event)=>{
       await criarTelaCadastroFuncionario();    
});


// abrir tela de cadastro produtos
ipcMain.handle("abrirCadastroProduto", async(event)=>{
       await criarTelaCadastroProduto();   
});

// chama a tela de gerente 
ipcMain.handle('abrirTelaGerente', async () => {
  try {
    await criarTelaGerente(); // notar await
    if (loginWindow && !loginWindow.isDestroyed()) {
      loginWindow.close();
      loginWindow = null;
    }
    return { success: true, message: 'Tela de Gerente aberta' };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
});

// chama a tela adm
ipcMain.handle('abrirTelaAdm', async () => {
  try {
    await admWindow(); // notar await
    if (loginWindow && !loginWindow.isDestroyed()) {
      loginWindow.close();
      loginWindow = null;
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-categorias', async (event) => {
   return await getCategoria();
});

ipcMain.handle('get-mesas', async (event) => {
  
    return await getMesas(); 
});

ipcMain.handle('get-produtos-por-categoria', async (event, idCategoria) => {
  return await getProdutosID(idCategoria);
  
});
ipcMain.handle('abrirCadastroMesa', async (event) => {
     await criarTelaCadastroMesa();
});
ipcMain.handle('cadastro-mesa', async (event, numero_mesa, status, n_cadeiras) => {
    return await cadastrarMesa(numero_mesa, status, n_cadeiras); 
});
  




