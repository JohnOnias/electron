import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


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
            preload: path.join(__dirname, '..', '..', 'router', 'cadastro', 'cadastroFuncionario.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

     win.loadFile(path.join(__dirname, '..', '..', 'views', 'cadastro', 'cadastroFuncionario.html')); 
    return win;
}