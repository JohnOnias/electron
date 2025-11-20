// src/controllers/login/loginController.js
import { BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let loginWindow = null;

// função para criar a janela
export async function criarLoginWindow() {
    if (loginWindow && !loginWindow.isDestroyed()) return loginWindow;

    nativeTheme.themeSource = 'dark';
    loginWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, '..', '..', 'router', 'login', 'login.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    loginWindow.loadFile(path.join(__dirname, '..', '..', 'views', 'login', 'login.html'));

    loginWindow.on('closed', () => {
        loginWindow = null;
    });

    return loginWindow;
}

// função para retornar a janela atual
export function getLoginWindow() {
    return loginWindow;
}
