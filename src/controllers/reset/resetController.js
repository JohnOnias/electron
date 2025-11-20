import { ipcMain } from "electron";
import { criarTelaVerificacaoToken } from '../../screens/reset/tokenWindow.js';
import { salvarToken, validarToken } from '../../models/reset/token.js';

import { enviarTokenEmail } from '../../models/reset/token.js';
import { atualizarSenha } from '../../models/reset/reset.js';
import { criarTelaReset } from '../../screens/reset/resetWindow.js';

export function resetController() {
    ipcMain.handle("abrirTelaDeVerificacaoToken", async () => {
    if (!VerificacaoToken) {
        await criarTelaVerificacaoToken();
        return { success: true };
    }
    return { success: false, message: "Tela já aberta" };
    });

    ipcMain.handle("gerar-token", async (_, email) => {
    return await salvarToken(email);
    });

    ipcMain.handle("gerar-e-enviar-token", async (_, email) => {
    const resultado = await salvarToken(email);
    if (!resultado) return null;

    try {
        await enviarTokenEmail(email, resultado.token);
        return { sucesso: true };
    } catch (err) {
        return { sucesso: false, erro: err.message };
    }
    });

    ipcMain.handle("validar-token", async (_, token) => {
    return (await validarToken(token)) ? true : false;
    });

    ipcMain.handle("resetar-senha", async (_, token, novaSenha) => {
    return await atualizarSenha(token, novaSenha);
    });

    ipcMain.handle("abrirResetTela", async () => {
    if (!resetWindow) await criarTelaReset();
    });

    ipcMain.handle("fecharResetTela", async () => {
    if (resetWindow) {
        resetWindow.close();
        resetWindow = null;
    }
    });

    ipcMain.handle("chamar-redefinir", async (_, email) => {
    return await verificarEmailCadastrado(email);
    });

};