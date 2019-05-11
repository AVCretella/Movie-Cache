var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu; //using electron's prebuilt menu
var app = electron.app;
var ipc = electron.ipcMain;
var myAppMenu, menuTemplate;

var appWindow, infoWindow, notAddedWindow, trailerWindow;

function toggleWindow(whichWindow){
  if(whichWindow.isVisible()){
    whichWindow.hide();
  } else {
    whichWindow.show();
  }
}

app.on('window-all-closed', () => {
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

app.on('ready', () => {

  createWindow();

  infoWindow = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    show: false,
    frame: false
  }); //infoWindow
  infoWindow.loadURL('file://' + __dirname + '/info.html'); //load info.html into a smaller window

  ipc.on('showNotAdded', (event, arg) => {
    event.returnValue='';
    notAddedWindow = new BrowserWindow({
      width: 400,
      height: 300,
      transparent: true,
      show: false
    }); //notAddedWindow
    notAddedWindow.loadURL('file://' + __dirname + '/notAddedDialog.html'); //load info.html into a smaller window
    notAddedWindow.show();
  }); //showNotAdded

  ipc.on('showTrailerOnYoutube', (event, arg) => {
    event.returnValue='';
    trailerWindow = new BrowserWindow({
      width: 800,
      height: 600,
      transparent: false,
      show: false
    }); //infoWindow
    let youtubeBaseUrl = 'https://www.youtube.com/results?search_query=';
    let searchTitle = arg;
    trailerWindow.loadURL(youtubeBaseUrl + searchTitle + '+trailer'); //load the url to the trailer for the movie
    trailerWindow.show();
  }); //showNotAdded

  appWindow.once('ready-to-show', () => {
    appWindow.show();
  }); //ready-to-show

  ipc.on('openInfoWindow', (event, arg) => {
    event.returnValue='';
    infoWindow.show();
  }); //closeInfoWindow

  ipc.on('closeInfoWindow', (event, arg) => {
    event.returnValue='';
    infoWindow.hide();
  }); //closeInfoWindow

  ipc.on('closeTrailerWindow', (event, arg) => {
    event.returnValue='';
    trailerWindow.hide();
  }); //closeInfoWindow

  ipc.on('exportList', (event, movieList, which) => {
    event.returnValue='';
    // let movies = JSON.stringify(movieList);
    const {dialog} = require('electron');
    const fs = require('fs');
    let movies = movieList;

    if (which == 'ranked') {
      //title is just the title of the dialog, not the path
      dialog.showSaveDialog(
      {
        message: 'Save Your Ranked Movie List\n The name you give will be replaced by RankedList.txt, do not change this',
        defaultPath: '~/RankedList.csv'
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
        defaultPath: '~/Watchlist.csv'
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
  }); //exportList

  ipc.on('importList', (event, which, arg) => {
    event.returnValue='';
    const {dialog} = require('electron');
    const fs = require('fs');
    const csv = require('csv-parse');
    // var csv = require('csv').parse;

    var importedList = [];

    dialog.showOpenDialog({title: 'Select the movie file that you would like to import'}, (filePath) => {
      event.sender.send('filePath', filePath);
      if (filePath != undefined) {
        if (which == 'watchlist') { //just need the movie titles
          fs.createReadStream(filePath[0])
          .pipe(csv())
          .on('data', function(data){
            try { //push the first element into the array
              if ( (data[0] != "") && (!importedList.includes(data[0])) ){ //try to get rid of duplicates
               importedList.push(data[0]);
               // event.sender.send('numtimes', 'pushed a movie');
              }
            } catch(err) { console.log(err); }
          })
          .on('end',function(){
            event.sender.send('pathReply', importedList);
          });
        } else {  //Dealing with the RankedList, need the title, personalRating, and timesSeen
          fs.createReadStream(filePath[0])
          .pipe(csv())
          .on('data', function(data){
            try { //push the first element into the array
              // importList.push(data);
              event.sender.send('rankedTestData', data[0]);

              if (data[0] != ""){
                //First field of csv is the name
                //Second column of the csv is the rank
                //Third column is the number of times seen
                var movieInfo = [data[0],data[1],data[2]];
               importedList.push(movieInfo);
               // event.sender.send('numtimes', 'pushed a movie');
              }
            } catch(err) { console.log(err); }
          })
          .on('end',function(){
            event.sender.send('pathReply', importedList);
          });
        }
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

  appWindow.on('closed', () =>  {
    appWindow = null;
    app.quit();
  });

}); //app is ready
