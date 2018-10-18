var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var app = electron.app;
var ipc = electron.ipcMain;

var appWindow, infoWindow;

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
