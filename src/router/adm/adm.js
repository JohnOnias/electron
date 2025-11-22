const {contextBridge, ipcRenderer} = require("electron");



try {const apiAdm = {
    
    abrirTelaAdm: () => ipcRenderer.invoke("abrirTelaAdm"),
    cadastrarFuncionario: (nome, cpf, email, cargo, senha) => ipcRenderer.invoke('cadastrar-funcionario', nome, cpf, email, cargo, senha),
    abrirTelaDeCadastroFuncionario: () => ipcRenderer.invoke('abrirCadastroFuncionario')
}

contextBridge.exposeInMainWorld('api', apiAdm);
    console.log('[preload-gerente] API exposta com sucesso - keys:', Object.keys(apiAdm));

}

catch(err){
    console.error('[preload-gerente] ERRO ao carregar preload:', err);

     
}
