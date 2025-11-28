// ============================================================
// subdividir o main em controllers cada um com sua resposabilidade
// ============================================================
import { app, BrowserWindow} from "electron";


// ============================================================
// Imports internos
// ============================================================
// home
import { criarLoginWindow } from '../screens/login/loginWindow.js';
import { criarTelaGerente } from "../screens/gerente/gerenteWindow.js";
import { admWindow } from "../screens/adm/admWindow.js";
import { criarTelaGarcom } from "../screens/garcom/garcomWindow.js";

// ============================================================
// Inicialização do App
// ============================================================
app.whenReady().then(() => {
  //criarLoginWindow();
  criarTelaGerente();
  
  
  //admWindow(); 
  //criarTelaGarcom(); 

// ============================================================
// chamar os controllers
//=============================================================
  loginController();
  categoriaController();
  produtoController();
  funcionarioController();
  mesaController();
  resetController();
  userController();
  gerenteController();
  admController();
  garcomController(); 
  pedidoController(); 

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});



// ============================================================
// importação dos controllers
// ============================================================
import { loginController } from './login/loginController.js';
import { categoriaController } from './cadastro/categoriaController.js';  
import { produtoController } from './cadastro/produtoController.js';
import { funcionarioController } from './cadastro/funcionarioController.js';
import { mesaController } from './cadastro/mesaController.js';
import { resetController } from './reset/resetController.js';
import { userController } from './user/userController.js';  
import { gerenteController } from './funcionario/gerenteController.js';
import {admController} from './adm/admController.js';
import { garcomController } from "./funcionario/garcomController.js";
import { pedidoController } from "./pedido/pedidoController.js";










