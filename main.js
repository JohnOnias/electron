const { app, BrowserWindow, nativeTheme } = require('electron')

// cria a janela index
const createWindow = () => {
    nativeTheme.themeSource = 'dark'
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    autoHideMenuBar: true
    //para adcionar um icone
    //,
    //icon: 'local da imagem aqui'
  })
     // renderiza a janela 
  win.loadFile('./src/views/index.html')
}

const sobreWindow = () => {
    nativeTheme.themeSource = 'dark'
    const sobre = new BrowserWindow({
        width: 360,
        height: 220,
        resizable: false,
        autoHideMenuBar: true
    })
    // renderiza a janela 
    sobre.loadFile('./src/views/sobre.html')
}


// aqui chama a janela principal quando se clica no app
app.whenReady().then(() => {
  createWindow()
  sobreWindow()

  // so abre outra janela se todas estiverem fechadas (para MAC)
 app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// quando a janela for fechada encerra a aplicação (para WIN e Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})