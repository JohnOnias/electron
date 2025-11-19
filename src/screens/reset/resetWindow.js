import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



// Necessário em ES Modules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export async function criarTelaReset() {
  nativeTheme.themeSource = 'dark';
  resetWindow = new BrowserWindow ({
    width: 450, 
    height: 450, 
    resizable: false, 
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../../router/reset/reset.js'),
      contextIsolation: true, 
      nodeIntegration: false
    }
  });

  resetWindow.loadFile('./src/views/login/ForgotPassword.html');

  resetWindow.on('closed', () => {
    resetWindow = null;
  });

  return resetWindow;
}