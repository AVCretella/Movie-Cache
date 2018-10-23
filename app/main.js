var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu; //using electron's prebuilt menu
var app = electron.app;
var ipc = electron.ipcMain;
var myAppMenu, menuTemplate;

var appWindow, infoWindow;

function toggleWindow(whichWindow){
  if(whichWindow.isVisible()){
    whichWindow.hide();
  } else {
    whichWindow.show();
  }
}

app.on('ready', function(){

  appWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600
  }); //appWindow
  appWindow.loadURL('file://' + __dirname + '/index.html'); //load index.html into appWindow

  infoWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    show: false,
    frame: false
  }); //infoWindow
  infoWindow.loadURL('file://' + __dirname + '/info.html'); //load info.html into a smaller window

  appWindow.once('ready-to-show', function(){
    appWindow.show();
  }); //ready-to-show

  ipc.on('openInfoWindow', function(event, arg){
    event.returnValue='';
    infoWindow.show();
  }); //closeInfoWindow

  ipc.on('closeInfoWindow', function(event, arg){
    event.returnValue='';
    infoWindow.hide();
  }); //closeInfoWindow

  menuTemplate = [
    {label: 'Movie Cache',
      submenu: [
        {
          label: 'About This App',
          accelerator: process.platform === 'darwin' ? 'Command+I':'Ctrl+I',
          click(item){ toggleWindow(infoWindow) }
        },
        {
          label: 'Add Movie',
          accelerator: process.platform === 'darwin' ? 'Command+N':'Ctrl+N', //this is determined by OS, 'darwin' is mac
          click(item,focusedWindow){
            if(focusedWindow){
              focusedWindow.webContents.send('addMovie'); //sends event over to the renderer process
            }
          }
        },
        {
          role: 'help',
          label: 'Our Website',
          click(){electron.shell.openExternal('https://humblebundle.com')}
        },
        {role: 'quit'},
        {role: 'close'}
      ]
    },
    {label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'selectall'}

      ]
    },
    {label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    }
  ];

  myAppMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(myAppMenu);
}); //app is ready

//TODO will have to reimplement for later
// app.on('activate', function(){
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (appWindow === null){
//     createWindow()
//   }
// });

//will want the functionality to click to reopen
