import { BrowserWindow,  nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export let loginWindow = null; 

export async function criarLoginWindow() {
    nativeTheme.themeSource = 'dark';
    loginWindow = new BrowserWindow({  
        width: 1920,
        height: 1080,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, '../../router/login/login.js'),
            contextIsolation: true, 
            nodeIntegration: false
        }
    });
    loginWindow.loadFile('./src/views/login/login.html');
    
    // Evento para limpar a referência quando a janela fechar
    loginWindow.on('closed', () => {
        loginWindow = null;
    });
    
    return loginWindow; 
}