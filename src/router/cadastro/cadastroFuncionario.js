import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
    // Cadastro de Funcionário
    cadastrarFuncionario: (nome, cpf, email, cargo, senha) =>
        ipcRenderer.invoke("cadastrar-funcionario", nome, cpf, email, cargo, senha),
    abrirTelaDeCadastroFuncionario: () => ipcRenderer.invoke("abrirCadastroFuncionario"),
});