import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {conn } from '../db/conn.js';

// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// criar a tela de cadastro de funcionario 
export function criarTelaCadastroFuncionario() {
    nativeTheme.themeSource = 'dark';

    const win = new BrowserWindow({
        width: 350,
        height: 550,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../../router/cadastro/cadastroFuncionario.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('./src/views/admin/cadastroFuncionario.html');
    return win;
}


export async function cadastrarFuncionario(nome, cpf, email, senha, tipoFuncionario) {
  const db = await conn();

  try{
    if (tipoFuncionario === "gerente") {
        const existirGerente = await verificarGerente(tipoFuncionario);
         if (existirGerente.length > 0) {
            throw new Error("Já existe um gerente cadastrado.");
      }
    }
    
    if(cpf){
      const existingCpf = await verificarCpf(cpf);
      if(existingCpf.length > 0){
        throw new Error("CPF já cadastrado.");
      }
    }
    if(email){
      const existingEmail = await verificarEmail(email);
      if(existingEmail.length > 0){
        throw new Error("E-mail já cadastrado.");
      }

    }
  } catch (err) {
    db.close();
    return { success: false, error: err.message };
  } 
  try {
   const hash = await bcrypt.hash(senha, saltRounds);
    await new Promise((resolve, reject) => {
      const query = `
        INSERT INTO tb_Funcionarios (nome, cpf, email, senha, tipo)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(query, [nome, cpf, email, hash, tipoFuncionario], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });

    db.close();
    return { success: true };

  } catch (err) {
    db.close();
    return { success: false, error: err.message };
  }
}