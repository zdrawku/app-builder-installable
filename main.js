// Modules to control application life and create native browser window
const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const util = require('util')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      partition: 'persist:infragistics'
    },
    icon: __dirname + '/assets/AppBuilderIcons_Windows.ico',
    show: false
  })

  let cookies = mainWindow.webContents.session.cookies;
  cookies.on('changed', function (cookie, removed) {
    if (cookie.session && !removed) {
      let url = util.format('%s://%s%s', (!cookie.httpOnly && cookie.secure) ? 'https' : 'http', cookie.domain, cookie.path);
      cookies.set({
        url: url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expirationDate: new Date().setDate(new Date().getDate() + 14)
      }, function (err) {
        if (err) {
          log.error('Error trying to persist cookie', err, cookie);
        }
      });
    }
  });
  
  // External links from browser-window to open in a default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    debugger;
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Remove menu bar
  mainWindow.setMenu(null);
  mainWindow.loadURL('https://cloud.indigo.design/login-and-redirect?target=appbuilder&path=/');
  mainWindow.maximize();
  mainWindow.show();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
