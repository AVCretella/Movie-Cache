var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu; //using electron's prebuilt menu
var app = electron.app;
var ipc = electron.ipcMain;
var myAppMenu, menuTemplate;

var appWindow, infoWindow;

//TODO wnat to print out to console

function toggleWindow(whichWindow){
  if(whichWindow.isVisible()){
    whichWindow.hide();
  } else {
    whichWindow.show();
  }
}

//TODO get this working
app.on('window-all-closed', function() {
  // Mac OS X - close is done explicitly with Cmd + Q, not just closing windows
    app.quit();
});

function createWindow(){
  console.log("created the appWindow");
  appWindow = new BrowserWindow({
    show: false,
    width: 1000,
    height: 800
  }); //appWindow
  appWindow.loadURL('file://' + __dirname + '/index.html'); //load index.html into appWindow
};

app.on('ready', function(){

  createWindow()

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

  ipc.on('exportList', function(event, movieList, which){
    event.returnValue='';
    let movies = JSON.stringify(movieList);
    const {dialog} = require('electron');
    const fs = require('fs');

    if (which == 'ranked') {
      //title is just the title of the dialog, not the path
      dialog.showSaveDialog(
      {
        message: 'Save Your Ranked Movie List\n The name you give will be replaced by RankedList.txt, do not change this',
        defaultPath: '~/RankedList.txt'
      }, (path) => {
        if (path != undefined) {
          fs.writeFile(path, movies, function(err) {
            if (err) {
                return console.log(err);
            }
          });
        }
      });
    } else {
      dialog.showSaveDialog(
      {
        message: 'Save Your Watchlist\n The name you give will be replaced by Watchlist.txt, do not change this',
        defaultPath: '~/Watchlist.txt'
      }, (path) => {
        if (path != undefined) {
          fs.writeFile(path, movies, function(err) {
            if (err) {
                return console.log(err);
            }
          });
        }
      });
    }
    // dialog.showOpenDialog(function (arg) {
    //
    // });
    // process.stdout.write('your output to command prompt console or node js ')
  }); //exportList

  ipc.on('importList', function(event, which, arg){
    event.returnValue='';
    const {dialog} = require('electron');
    const fs = require('fs');
    const csv = require('csv-parse');

    var importedList = [];

    dialog.showOpenDialog({title: 'Select the movie file that you would like to import'}, (filePath) => {
      if (filePath !== undefined) {
        if (which == 'watchlist') { //just need the movie titles
          fs.createReadStream(filePath[0])
          .pipe(csv())
          .on('data', function(data){
            try { //push the first element into the array
              if (data[0] != ""){
               importedList.push(data[0]);
              }
            }
            catch(err) {
              console.log(err);
            }
          })
          .on('end',function(){
            event.sender.send('pathReply', importedList);
          });
        } else {
          console.log("hello this wont print");
        }

        event.sender.send('pathReply', filePath[0]);
      }
    });
  }); //importList

  menuTemplate = [
    {label: 'Movie Cache',
      submenu: [
        {
          label: 'About This App',
          accelerator: process.platform === 'darwin' ? 'Command+I':'Ctrl+I',
          click(item){ toggleWindow(infoWindow) }
        },
        // {
        //   label: 'Add Movie',
        //   accelerator: process.platform === 'darwin' ? 'Command+N':'Ctrl+N', //this is determined by OS, 'darwin' is mac
        //   click(item,focusedWindow){
        //     if(focusedWindow){
        //       focusedWindow.webContents.send('addMovie'); //sends event over to the renderer process
        //     }
        //   }
        // },
        {
          role: 'help',
          label: 'Github Page',
          click(){electron.shell.openExternal('https://github.com/AVCretella')} //open a website from the menus
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
        {type: 'separator'}, //this puts a horizontal line in the menu
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

  appWindow.on('closed', function() {
    appWindow = null;
    app.quit();
  });

}); //app is ready

//TODO will have to reimplement for later
// app.on('activate-with-no-open-windows', function(){
//   console.log('I am being clicked');
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (appWindow === null){
//     createWindow()
//   } else {
//     appWindow.show();
//   }
// });

//will want the functionality to click to reopen
