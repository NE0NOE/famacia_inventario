const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    // Hide the application menu completely
    Menu.setApplicationMenu(null);

    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Load the web app
    win.loadURL('https://dulcesperanzafm.dpdns.org');

    // Handle printing via a hidden window (fixes Windows print issues)
    ipcMain.on('print-invoice', (event, htmlContent) => {
        const printWin = new BrowserWindow({
            show: false,
            width: 400,
            height: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        printWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

        printWin.webContents.on('did-finish-load', () => {
            printWin.webContents.print({ silent: false, printBackground: true }, (success, failureReason) => {
                if (!success && failureReason !== 'cancelled') {
                    console.error('Print failed:', failureReason);
                }
                printWin.close();
            });
        });
    });

    // Prevent window.open from creating broken popups - redirect to main window or handle gracefully
    win.webContents.setWindowOpenHandler(({ url }) => {
        // Allow about:blank for print (but we handle it via IPC now)
        if (url === '' || url === 'about:blank') {
            return { action: 'deny' }; // Block blank popups since we use IPC for printing
        }
        // Open external links in the system browser
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });
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
