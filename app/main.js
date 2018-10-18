var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var app = electron.app;
var ipc = electron.ipcMain;

app.on('ready', function() {
  var appWindow, infoWindow;

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

  appWindow.once('ready-to-show', function() {
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

//will want the functionality to click to reopen
