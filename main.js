const { app, BrowserWindow, ipcMain, Menu, clipboard, session } = require('electron');
const path = require('path');
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const fetch = require('cross-fetch');

// Fonction pour activer le bloqueur de publicités avec EasyList
async function enableAdBlocker() {
  try {
    console.log('Démarrage de l\'activation du bloqueur de publicités...');
    const blocker = await ElectronBlocker.fromLists(fetch, [
      'https://easylist.to/easylist/easylist.txt',
      'https://filters.adtidy.org/extension/ublock/filters/3.txt',
      'https://filters.adtidy.org/extension/ublock/filters/5.txt'
    ]);
    console.log('Bloqueur de publicités chargé.');
    blocker.enableBlockingInSession(session.defaultSession);
    console.log('Blocage des publicités activé dans la session.');
  } catch (error) {
    console.error('Erreur lors de l\'activation du bloqueur de publicités :', error);
  }
}

// Fonction pour créer une nouvelle fenêtre
function createWindow(url) {
  console.log('URL reçue pour ouvrir la fenêtre:', url); // Vérifiez l'URL reçue

  const win = new BrowserWindow({
    width: 1380,
    height: 920,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: false,  // Désactiver la sécurité web pour déboguer
    },
  });

  if (url && url.startsWith('http')) {
    win.loadURL(url)
      .then(() => console.log('URL chargée avec succès:', url))
      .catch(error => console.error('Erreur lors du chargement de l\'URL:', error));
  } else {
    console.error('URL invalide ou manquante:', url);
    win.loadURL('about:blank'); // Charger une page vide en cas d'URL invalide
  }

  // Ajouter un menu contextuel
  const contextMenu = Menu.buildFromTemplate([
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { type: 'separator' },
    { role: 'selectall' },
    { type: 'separator' },
    {
      label: 'Revenir à la page précédente',
      click: () => {
        if (win.webContents.canGoBack()) {
          win.webContents.goBack();
        }
      },
      enabled: false
    },
    {
      label: 'Aller à la page suivante',
      click: () => {
        if (win.webContents.canGoForward()) {
          win.webContents.goForward();
        }
      },
      enabled: false
    },
    {
      label: 'Copier l\'URL',
      click: () => {
        clipboard.writeText(win.webContents.getURL());
      },
      enabled: false
    },
    { type: 'separator' },
    { role: 'reload' },
    { role: 'forcereload' },
    { role: 'toggledevtools' },
    { type: 'separator' },
    { role: 'quit' }
  ]);

  win.webContents.on('context-menu', (event) => {
    const canGoBack = win.webContents.canGoBack();
    const canGoForward = win.webContents.canGoForward();

    contextMenu.items.find(item => item.label === 'Revenir à la page précédente').enabled = canGoBack;
    contextMenu.items.find(item => item.label === 'Aller à la page suivante').enabled = canGoForward;
    contextMenu.items.find(item => item.label === 'Copier l\'URL').enabled = Boolean(win.webContents.getURL());

    contextMenu.popup(win);
  });

  return win;
}

// Fonction pour créer la fenêtre principale
async function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1380,
    height: 920,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'Logo.png'),
  });

  mainWindow.loadFile('index.html');

  // Supprimer le menu
  mainWindow.removeMenu();

  // Ajouter un menu contextuel classique
  const contextMenu = Menu.buildFromTemplate([
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { type: 'separator' },
    { role: 'selectall' },
    { type: 'separator' },
    {
      label: 'Revenir à la page précédente',
      click: () => {
        if (mainWindow.webContents.canGoBack()) {
          mainWindow.webContents.goBack();
        }
      },
      enabled: false
    },
    {
      label: 'Aller à la page suivante',
      click: () => {
        if (mainWindow.webContents.canGoForward()) {
          mainWindow.webContents.goForward();
        }
      },
      enabled: false
    },
    {
      label: 'Copier l\'URL',
      click: () => {
        clipboard.writeText(mainWindow.webContents.getURL());
      },
      enabled: false
    },
    { type: 'separator' },
    { role: 'reload' },
    { role: 'forcereload' },
    { role: 'toggledevtools' },
    { type: 'separator' },
    { role: 'quit' }
  ]);

  mainWindow.webContents.on('context-menu', (event) => {
    const canGoBack = mainWindow.webContents.canGoBack();
    const canGoForward = mainWindow.webContents.canGoForward();

    contextMenu.items.find(item => item.label === 'Revenir à la page précédente').enabled = canGoBack;
    contextMenu.items.find(item => item.label === 'Aller à la page suivante').enabled = canGoForward;
    contextMenu.items.find(item => item.label === 'Copier l\'URL').enabled = Boolean(mainWindow.webContents.getURL());

    contextMenu.popup(mainWindow);
  });
}

app.whenReady().then(async () => {
  await enableAdBlocker();
  createMainWindow();

  ipcMain.handle('open-new-window', (event, url) => {
    return new Promise((resolve, reject) => {
      const win = createWindow(url);
      win.on('ready-to-show', () => resolve());
      win.on('unresponsive', () => reject('Window is unresponsive'));
      win.on('crashed', () => reject('Window crashed'));
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
