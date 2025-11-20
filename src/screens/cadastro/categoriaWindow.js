import { BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export function criarTelaCadastroCategoria() {
    nativeTheme.themeSource = 'dark';
    const win = new BrowserWindow({
        width: 350,
        height: 550,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true
        }
    });
    win.loadFile('./src/views/gerente/cadastroCategoria.html'); 
}
