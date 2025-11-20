import { BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export async function criarTelaGerente() {
    nativeTheme.themeSource = 'dark';
    const gerenteWindow = new BrowserWindow({
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
    gerenteWindow.loadFile(path.join(__dirname, '..', '..', 'views', 'gerente', 'gerente.html')); 
    return gerenteWindow;
}
