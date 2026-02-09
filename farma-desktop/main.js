const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
    // Hide the application menu completely
    Menu.setApplicationMenu(null);

    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        autoHideMenuBar: true, // Hides the menu bar
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Load the web app (in development, you might point this to localhost:5173)
    win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
