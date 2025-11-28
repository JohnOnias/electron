import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let win = null
// criar a tela de cadastro de funcionario 
export function criarTelaPedido() {
    nativeTheme.themeSource = 'dark';

    win = new BrowserWindow({
        width: 350,
        height: 550,
        resizable: true,
        autoHideMenuBar: false,
        webPreferences: {
            preload: path.join(__dirname, '..', '..', 'router', 'pedido', 'pedido.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

     win.loadFile(path.join(__dirname, '..', '..', 'views', 'pedido', 'pedido.html')); 
    return win;
}
export function fecharTelaPedido() {
    if (win) {
        win.close();
        win = null;
    }
}