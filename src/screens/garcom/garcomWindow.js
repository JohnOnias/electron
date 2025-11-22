import { BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export async function criarTelaGarcom() {
    nativeTheme.themeSource = 'dark';
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        resizable: false,
        //autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '..', '..', 'router', 'gerente', 'gerente.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadFile(path.join(__dirname, '..', '..', 'views', 'garcom', 'garcom.html')); 
    return win;
}
