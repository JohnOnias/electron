import { BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export async function admWindow(){
    nativeTheme.themeSource = 'dark';
    const adm = new BrowserWindow({
        width: 1920,
        height: 1080,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, 
            nodeIntegration: false
        }
    });
    adm.loadFile('./src/views/adm/adm.html');
    return adm; 
}
