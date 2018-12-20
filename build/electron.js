const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
const ipcMain = electron.ipcMain;

ipcMain.on('min', e => mainWindow.minimize());
ipcMain.on('max', e => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize()
  }
});
ipcMain.on('close', e => mainWindow.close());


const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

//主窗体
let mainWindow;
let tray = null;
//登录窗体
let loginWindow;


function createWindow() {
  // loginWindow = new BrowserWindow({
  //   width: 600,
  //   height: 400,
  //   frame: false,
  //   transparent: true,
  //   hasShadow: true,
  //   // show: false,
  //   // parent: mainWindow, //win是主窗口
  // });
  // loginWindow.loadURL(path.join('file:', __dirname, '../dist/index.html')); //new.html是新开窗口的渲染进程
  // loginWindow.on('closed', () => {
  //   newwin = null;
  //   mainWindow.show();
  // });
  // loginWindow.webContents.openDevTools();

  ipcMain.on('go-mianWindow', e => {
    // loginWindow.close();
    // mainWindow.show();
    mainWindow.setSize(900, 600)
  });
  ipcMain.on('not-login', e => {
    loginWindow.show();
  });


  //主窗体
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    // transparent: true,
    hasShadow: true,
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // 打开窗口的调试工具
  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);
  // 窗口关闭的监听
  mainWindow.on('closed', (event) => {
    mainWindow = null;
  });
  mainWindow.on('close', (event) => {
    mainWindow.hide();
    mainWindow.setSkipTaskbar(true);
    event.preventDefault();
  });
  mainWindow.on('show', () => {
    tray.setHighlightMode('always')
  });
  mainWindow.on('hide', () => {
    tray.setHighlightMode('never')
  });
  tray = new Tray(path.join(__dirname, 'icon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出', click: () => {
        mainWindow.destroy()
      },
    },
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'}
  ]);
  tray.setToolTip('My托盘测试'); //鼠标移动上去显示
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    mainWindow.isVisible() ? mainWindow.setSkipTaskbar(false) : mainWindow.setSkipTaskbar(true);
  });

}


app.on('ready', createWindow);


// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// });
//
// app.on('activate', function () {
//   if (mainWindow === null) {
//     createWindow()
//   }
// });




