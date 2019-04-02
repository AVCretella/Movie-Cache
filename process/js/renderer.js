/*
  Alex Cretella
  Honors By Contract Project - Movie Cache
  Wanted to learn React
*/

//copy and paste libraries here
var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var _ = require('lodash');
// var remote = eRequire('electron').remote;
var dialog = eRequire('electron').remote;
console.log("hthis is dialgo, ",dialog);

var fs = eRequire('fs');//eRequire to show that we are working with node now
var watchlistMovieData = JSON.parse(fs.readFileSync(watchlistDataLocation));//Will go to the dataLocation defined in index.html and create a proper data file from the file there
var rankedMovieData = JSON.parse(fs.readFileSync(rankedDataLocation));//Will go to the dataLocation defined in index.html and create a proper data file from the file there
// var watchlistMovieData = require('../../data/watchlist_data.json');
// var rankedMovieData = JSON.parse(fs.readFileSync(watchlistDataLocation));
var electron = eRequire('electron');
var ipc = electron.ipcRenderer;

var React = require('react');
var ReactDOM = require('react-dom');
// var HashRouter = require('react-router-dom');
// import { HashRouter as Router, Route, Link } from "react-router-dom";
var RankedMovies = require('./RankedMovies');
var WatchlistMovies = require('./WatchlistMovies');
var Toolbar = require('./Toolbar');
var HeaderNav = require('./HeaderNav');
var MovieList = require('./MovieList');
var ImportedReportModal = require('./ImportedReportModal');
// const Sidebar = require('./Sidebar.js');

/*==============================================================================
                                Main Interface
==============================================================================*/
//These are the fields that will populate the search bar when a specific list is being displayed
let rankedSortFields = [
  { field: "movieName", displayName: "Movie Name" },
  { field: "releaseDate", displayName: "Release Date" },
  { field: "duration", displayName: "Duration" },
  { field: "rank", displayName: "Rank" }
];

let watchlistSortFields = [
  { field: "movieName", displayName: "Movie Name" },
  { field: "releaseDate", displayName: "Release Date" },
  { field: "duration", displayName: "Duration" }
];

//Define all of the genres that we can choose from. Got them from IMDB list
let genreItems = ["All", "Action","Adventure","Animation","Biography","Comedy","Crime","Documentary","Drama","Family","Fantasy","Film Noir",
"History","Horror","Music","Musical","Mystery","Romance","Sci-Fi","Short","Sport","Superhero","Thriller","War","Western"];

let watchlistTitle = "Watchlist";
let rankedListTitle = "Favorite Movies"

var MainInterface = React.createClass({
  //this will load the retrieved data into an object for this component
  //begins with the ranked movielist view
  getInitialState: function() {
    return {
      movieFormVisible: false,
      orderBy: 'rank',
      orderDir: 'asc',
      genre: 'All',
      queryText: '',
      myMovies: rankedMovieData,
      MovieListItem: RankedMovies,
      movieListTitle: rankedListTitle,
      sortFields: rankedSortFields,
      fileLocation: rankedDataLocation,
      errorMovies: []
    } //return
  },

  //componentDidMount and componentWillUnmount handle all of the menu operations that we define in main.js
  componentDidMount: function() {
    ipc.on('addMovie', function(event, message) {
      this.toggleAddMovieForm();
    }.bind(this));
  }, //componentDidMount

  componentWillUnmount: function() {
    ipc.removeListener('addMovie', function(event, message) {
      this.toggleAddMovieForm();
    }.bind(this));
  }, //componentDidMount

  componentDidUpdate: function() {
    fs.writeFile(this.state.fileLocation, JSON.stringify(this.state.myMovies), 'utf8', function(err) {
      if (err) {
        console.log(err);
      }
    }); //will go to the file location that our data is at and change it
  }, //componentDidUpdate

  writeMovieListToFile: function(whichList) {
    var exportMovies = [];

    if (whichList == rankedListTitle){  //we want to get the movie title, the personal rank, and the times seen, just save those
      rankedMovieData.forEach(function(movie, idx, rankedMovieData){
        var movieObject = [];

        var name = movie.movieName;
        console.log("this is name: ", name);
        // var nameFormatted = "";
        while (name.indexOf(",") != -1) { //Replace any existing commas, so the csv can be parsed correctly
          console.log("found , at index: ", name.indexOf(","));
          indexToReplace = name.indexOf(","); //get the index of the comma
          name = name.substr(0, indexToReplace) + "-" + name.substr(indexToReplace + 1, name.length);
        }
        movieObject.push(name);
        movieObject.push(movie.rank);
        movieObject.push(movie.viewCount);
        exportMovies.push(movieObject);
      });
      var csvFormat = exportMovies.join('\n');
      console.log("this is csv format for ranked: ", csvFormat);
      ipc.sendSync('exportList', csvFormat, 'ranked');
    } else { // == "WatchList Movies", we just want to grab the title and make it into it's own line of a csv
      watchlistMovieData.forEach(function(movie, idx, watchlistMovieData){
        movieObject = movie.movieName;
        exportMovies.push(movieObject);
      });
      exportMovies.forEach(function(movie, idx, exportMovies){ //scrub for commas, replace with - because search can disregard those
        while (movie.indexOf(",") != -1) { //Replace any existing commas, so the csv can be parsed correctly
          indexToReplace = movie.indexOf(","); //get the index of the comma

          //TODO what we did above, we can probably do here,save to array, then push to exportMovies
          //Need to update both of these to reflect the changes
          exportMovies[idx] = movie.substr(0, indexToReplace) + "-" + movie.substr(indexToReplace + 1, movie.length);
          movie = movie.substr(0, indexToReplace) + "-" + movie.substr(indexToReplace + 1, movie.length);
        }
      });
      var csvFormat = exportMovies.join('\n');
      // console.log("this is csv format: ", csvFormat);
      ipc.sendSync('exportList', csvFormat, 'watch');
    }
  },

  //TODO still need to write this one and convert the old format for austen
        //He is currently still on the personal rank patch, so we need to read in the "rank" as personal rank, and then change that to rank, fuck how am i going to test this??
  addToRankedFromFile: function(rankedFileMovieList) {
    let moviesNotFound = []; //TODO movies that weren't formatted correctly, return to user so they can try manually
    let matchedMovies = []; //TODO tell the user which movies in the uploaded list matched existing ones
    let currentMovies = this.state.myMovies.slice();
    // let addedMovies = []; //The movies we've sent to the API and stored information and want to add to the list
    let tempMovieObject = {}; //where we will save the responses to each of the API calls

    console.log("THIS THE LIST BOI: ", rankedFileMovieList);

    const baseQuery = 'http://www.omdbapi.com/?t=';
    const APIkey = '&apikey=2d5be971';
    const longPlot = '&plot=full'; //The long plot is really long and i think not worth getting, very filling of the app
    const shortPlot = '&plot=short';

    const boundAddMovieObject = this.addMovieObject;

    //TODO i can just sort the rankedFileMovieList by the first index, that'll put them in order, then just tack on the ranks when adding
    rankedFileMovieList.forEach(function(movieInfo, idx, rankedFileMovieList){
      let movieTitle = movieInfo[0];
      let listRank  = parseInt(movieInfo[1].match(/[0-9]+/g)[0]); //only in the ranked list
      let timesSeen = parseInt(movieInfo[2].match(/[0-9]+/g)[0]);

      let userRating = 8.7; //TODO need to make sure to use this number to generate the ranks for austen. Make sure it is an int btw


      //TODO currentMovies never updates, so if it wasn't there to begin with, wont find a duplicate
      if (!currentMovies.find(x => x.movieName.toLowerCase() === movieTitle.toLowerCase())) { //if already in watchlist, don't waste time on duplicate query + addition
      console.log("++++++++++++++");
      console.log("currentmovies check: ", currentMovies);
      console.log("starting fetch for: ", movieTitle);
      console.log("----------------");
        let APIquery = baseQuery + movieTitle + shortPlot + APIkey;
        fetch(APIquery) //send the query to OMDB for searching
        .then(response => response.json())
        .then(json =>{
          if(json.Response != "False"){ //if we don't get an error from the API, store info
            //reformat duration and year to be saved as ints, not strings
            var durationMinutes = parseInt(json.Runtime.match(/[0-9]+/g)[0]);
            var releaseDateInt = parseInt(json.Year.match(/[0-9]+/g)[0]);
            let formattedGenres = json.Genre.split(', ');
            let formattedActors = json.Actors.split(', ');

            tempMovieObject = {
              movieName: json.Title,
              posterURL: json.Poster,
              directorName: json.Director,
              actors: formattedActors,
              genres: formattedGenres,
              releaseDate: releaseDateInt,
              Summary: json.Plot,
              duration: durationMinutes,
              viewCount: timesSeen,
              personalRating: userRating,
              rank: listRank
            };
            // console.log(tempMovieObject);
            currentMovies.push(tempMovieObject); //So that we check for duplicates even within our uploaded file
            console.log("ending fetch for: ", tempMovieObject.movieName);
            boundAddMovieObject(tempMovieObject);
          } else {
            moviesNotFound.push(movieTitle);
            // console.log("didnt find: ", movieName);
          }
        });
      } else {
        matchedMovies.push(movieTitle);
        console.log("found duplicate in addToRankedFromFile: ", movieTitle);
      }
    });
    // console.log("=======");
    // // console.log("this is added movies: ", addedMovies);
    // // console.log("this is currentMovies and what the wishlist should be: ", currentMovies);
    // // console.log("matched movie in list already, deal with these yourself you filthy animal: ", matchedMovies);
    // // console.log("these titles didnt return anything, need to do manually: ", moviesNotFound);
    // console.log("=======");

    /*
    TODO now that everything is added, let's create a popup modal with the movies that weren't added because the names were messed up, and the ones that were duplicates
    Making a modal popup should actually make the list render properly, rather than waiting for another action to happen First
    */
  },

  addToWatchlistFromFile: function(fileMovieList) {
    let moviesNotFound = []; //TODO movies that weren't formatted correctly, return to user so they can try manually
    let matchedMovies = []; //TODO tell the user which movies in the uploaded list matched existing ones
    let currentMovies = this.state.myMovies.slice();
    let tempMovieObject = {}; //where we will save the responses to each of the API calls
    let addedMovies = []; //The movies we've sent to the API and stored information and want to add to the list

    const baseQuery = 'http://www.omdbapi.com/?t=';
    const APIkey = '&apikey=2d5be971';
    const longPlot = '&plot=full';
    const shortPlot = '&plot=short';
    const boundAddMovieObject = this.addMovieObject; //A call to a function cannot be made from inside the fetch, need to bind to the function call

    // console.log("this is what ed wants", fileMovieList);
    fileMovieList.forEach(function(movieName, idx, fileMovieList){
      //TODO currentMovies never updates, so if it wasn't there to begin with, wont find a duplicate
      if (!currentMovies.find(x => x.movieName.toLowerCase() === movieName.toLowerCase())) { //if already in watchlist, don't waste time on duplicate query + addition
        let APIquery = baseQuery + movieName + shortPlot + APIkey;
        fetch(APIquery) //send the query to OMDB for searching
        .then(response => response.json())
        .then(json =>{
          if(json.Response != "False"){ //if we don't get an error from the API, store info
            //reformat duration and year to be saved as ints, not strings
            var durationMinutes = parseInt(json.Runtime.match(/[0-9]+/g)[0]);
            var releaseDateInt = parseInt(json.Year.match(/[0-9]+/g)[0]);
            let formattedGenres = json.Genre.split(', ');
            let formattedActors = json.Actors.split(', ');

            //Generate a movie object and send it to be added to the rankedList
            tempMovieObject = {
              movieName: json.Title,
              posterURL: json.Poster,
              directorName: json.Director,
              actors: formattedActors,
              genres: formattedGenres,
              releaseDate: releaseDateInt,
              Summary: json.Plot,
              duration: durationMinutes
            };

            currentMovies.push(tempMovieObject); //So that we check for duplicates even within our uploaded file
            boundAddMovieObject(tempMovieObject);
          } else {
            moviesNotFound.push(movieName);
            // console.log("didnt find: ", movieName);
          }
        });
      } else {
        matchedMovies.push(movieName);
        console.log("found duplicate in add to ranked from file: ", movieName);
      }
    });
    // console.log("=======");
    // // console.log("this is added movies: ", addedMovies);
    // // console.log("this is currentMovies and what the wishlist should be: ", currentMovies);
    // // console.log("matched movie in list already, deal with these yourself you filthy animal: ", matchedMovies);
    // // console.log("these titles didnt return anything, need to do manually: ", moviesNotFound);
    // console.log("=======");
  },

  /*
  TODO Also, we need to check if we are adding to the ranked list and make sure that the movies have a rank and stuff too,
  or we can save the ones that don't and ask the user to give a personal rank and times seen to each.
  Could be a lot of initial work for a user but very owrth it, and much quicker than searching for everything beforehand
  */
  //Up arrow button on movieList interface clicked, want to select a file from machine and import the list of movies
  importMoviesFromFile: function(whichList) {
    var importedMovieList = [];
    if(this.state.movieListTitle == rankedListTitle){ //call the method in main.js
      var importedMovies = ipc.sendSync('importList', 'ranked');
    } else {
      var importedMovies = ipc.sendSync('importList', 'watchlist');
    }

    ipc.on('pathReply', (event, arg) => {
      importedMovieList = arg;
      // console.log('this is imported list from renderer: ', importedMovieList);
      if(this.state.movieListTitle == rankedListTitle){
        this.addToRankedFromFile(importedMovieList);
        // console.log("hello we should add to ranked, we are in 'pathReply rn'", importedMovieList);
      } else {
        this.addToWatchlistFromFile(importedMovieList);
        // console.log("hello we should add to wishlist, we are in 'pathReply rn'", importedMovieList);
      }
    });

    ipc.on('numtimes', (event, arg) => { //just to track the number of times a movie is added
      console.log("xxxx ",arg);
    });

    ipc.on('filePath', (event, arg) => { //just to see we are grabbing the right file
      // console.log("in filepath================================");
      console.log(">>>> ", arg);
    });
  },

  //This needs to accomodate the moving function
  addRankedObject: function(tempItem) {
    let tempMovies = this.state.myMovies;
    let rankedListLength = (JSON.parse(fs.readFileSync(rankedDataLocation))).length;
    console.log("rankedlistlength rn: ", rankedListLength);
    console.log("====", tempItem.movieName, "rank given ", tempItem.rank)
    //TODO no check for below 0 because it isn't supposed to happen, but i should have the check
    if (tempItem.rank > rankedListLength) { //if it is from the ranked list, it'll have a rank
      tempItem.rank = rankedListLength + 1; //should be myMovies.length because the 0 index is #1, so myMovies.length index is #myMovies.length
      tempMovies.push(tempItem);
    } else { //it was given a valid rank that was within the range of the list, insert it where it should go
      tempMovies.splice(tempItem.rank - 1, 0, tempItem); //add the item to it's rightful spot
      let startIndex = tempItem.rank;
      let currentIndex;
      for (currentIndex = startIndex; currentIndex < tempMovies.length; currentIndex++) {
        tempMovies[currentIndex].rank = tempMovies[currentIndex].rank + 1; //add one to the existing ranks below the newly inserted
      }
    }
    console.log("====" ,tempItem.movieName, " rank end", tempItem.rank);
    this.setState({
      myMovies: tempMovies
    });
  },

  //TODO THERE IS NO REASON THIS SHOULDNT BE HOOKED UP TO A DATABASE!!! HOOK IT UP BOI
  //If the movie being added already exists, then don't add it
  addMovieObject: function(tempItem) { //receives object saves in form
    var tempMovies = this.state.myMovies;
    if (_.findIndex(tempMovies, {movieName: tempItem.movieName}) == -1) { //if this is a duplicate item, stop processing
      if (tempItem.rank != undefined) { //if we are working with a ranked object
        this.addRankedObject(tempItem);
      } else {
        //TODO splice one into the right spot, and push the others down the list
        tempMovies.push(tempItem);
        this.setState({
          myMovies: tempMovies
        });
      }
    } else {
      console.log(tempItem.movieName, "not added because already on list");
    }
    console.log("movie item added: ", tempItem);
  },

  //When an item is identified to be in the ranked list, we will need to adjust all the other items below to reflect the deletion
  deleteRankedObject: function(item) {
    let tempMovies = this.state.myMovies;
    console.log("deleting the item: ", item.movieName);
    tempMovies.splice(item.rank - 1, 1); //delete the item. It's index is = rank-1
    console.log("this is tempMovies: ", tempMovies);

    //now adjust all of the movies that were ranked below the one removed
    let startIndex = item.rank - 1; //the first affected movie will have shifted into the removed item's index
    let currentIndex;
    for (currentIndex = startIndex; currentIndex < tempMovies.length; currentIndex++) {
      tempMovies[currentIndex].rank = tempMovies[currentIndex].rank - 1; //add one to the existing ranks below the newly inserted
    }
    this.setState({
      myMovies: tempMovies
    });
  },

//TODO should split into delete watchlistobject and rankedobject, but for now, just an if statement wil do
  deleteMovieObject: function(item) {
    if (item.rank != undefined) { //if we are working with a ranked object
      this.deleteRankedObject(item);
    } else {
      var allMovies = this.state.myMovies;
      var newMovies = _.without(allMovies, item); //return array without the one movie passed
      this.setState({
        myMovies: newMovies
      });
      console.log("deleted: ", item.movieName);
    }
  },

  /*
    TODO the only issue is that we are basically doing a special delete and add now because of how we stored the ranked list.
      but it's either that or make the add and delete function sort the ranked data on every single addition and deletion.
      but since addition and deletion are used so much more often, i dont think this is a terrible solution.
  */
  //When changing rank, we need to adjust the range of indexes a movie has moved
  changeMovieRank: function(newRank, oldRank) {
    var allMovies = this.state.myMovies;
    //TODO could run into issues of movies with the same name
        //may end up changing rank of diff one because it comes up first
    //TODO changing this ---> storing movies in order, can just delete the rank - 1 (it will be the index of the movie)
      // var index = _.findIndex(allMovies, {movieName: item.movieName}); //index of the movie that we want to change rank of

    let startIndex, endIndex, currIndex;
    // let newRank = item.rank;

    //SINCE EVERYTHING IS STORED IN ORDER IN THE RANKED DATALIST, WE CAN DO IT THIS WAY
    //The rank is reflective of -[ index + 1 ]- for a movie
    if (newRank != oldRank) { //first check that we actually have to do anything
      let item = allMovies[oldRank - 1]; //save our item to re-insert later
      item.rank = newRank;
      if (newRank < oldRank) { //moving to a better rank on the movie list (higher on list, lower number)
        startIndex = item.rank - 1; //want to start at the index the movie will move to             | These two depend of when we delete the movie item |
        endIndex = oldRank - 2; //finish at the index prior to where the movie used to be           | _________________________________________________ |
        allMovies.splice(oldRank - 1, 1) //remove the item with the old rank
        for(currIndex = startIndex; currIndex <= endIndex; currIndex++) { //increments each of the movie items that are now below the item that previously were not
          allMovies[currIndex].rank++;
        }
        allMovies.splice(startIndex, 0, item); //adds the item to the new rank position
      } else {  //this means that the new rank is worse than the old one, need to bump up the movies that will now be above this one
                //Also need to check if the new rank is out of bounds now, set the movie to the last index
        if (item.rank > allMovies.length) {
          console.log("GREATER THAN LENGTH");
          item.rank = allMovies.length;
        }
        startIndex = oldRank - 1; //want to start at the index the movie is leaving                 | These two depend of when we delete the movie item |
        endIndex = item.rank - 1; //finish at the index prior to where the movie will to be         | _________________________________________________ |
        console.log("start index : ", startIndex);
        console.log("end index: ", endIndex);
        allMovies.splice(oldRank - 1, 1) //remove the item with the old rank
        for(currIndex = startIndex; currIndex < endIndex; currIndex++) { //decrements each of the movie items that are now above the item that previously were not
          allMovies[currIndex].rank--;
        }
        allMovies.splice(endIndex, 0, item); //adds the item to the new rank position
      }
    }
    this.setState({
      myMovies: allMovies
    });
  },

  //Given an item with ranked format (all movie info + rank and timesSeen), write it directly to rankedDataLocation and then delete
  //the item from the watchlist

  //Needs to behave a little differently than just adding a ranked movie object because we cannot access the state because we are on the wrong list
    //We need to directly access the ranked data to modify correctly
  //TODO holy shit this needs a rework, need to add to rankedDataLocation correctly, like in order, fuck
  moveMovieToFavorites: function(item){

    let rankedMovies = JSON.parse(fs.readFileSync(rankedDataLocation));
    let rankedListLength = rankedMovies.length;
    if (item.rank > rankedListLength) { //if it is from the ranked list, it'll have a rank
      item.rank = rankedListLength + 1; //should be myMovies.length because the 0 index is #1, so myMovies.length index is #myMovies.length
      rankedMovies.push(item);
    } else { //it was given a valid rank that was within the range of the list, insert it where it should go
      console.log("a valid rank was given")
      rankedMovies.splice(item.rank - 1, 0, item); //add the item to it's rightful spot
      let startIndex = item.rank;
      let currentIndex;
      for (currentIndex = startIndex; currentIndex < rankedMovies.length; currentIndex++) {
        rankedMovies[currentIndex].rank = rankedMovies[currentIndex].rank + 1; //add one to the existing ranks below the newly inserted
      }
    }

    //TODO THIS IS GARBAGE POOPOO WAY TO DO THIS, ED WOULD RIP MY NUTS OFF
    //Force the update to the ranked list because we don't have accept to it through state right now because we are displaying the watchlist
    fs.writeFile(rankedDataLocation, JSON.stringify(rankedMovies), 'utf8', function(err) {
      if (err) {
        console.log(err);
      }
    }); //will go to the file location that our data is at and change it


    // console.log("rankedMovieData before the push: ", rankedMovieData);
    // newRanked = JSON.parse(fs.readFileSync(rankedDataLocation));
    // newRanked.push(item);
    // // rankedMovieData.push(item);
    // console.log("rankedMovieData after the push: ", rankedMovieData);
    // fs.writeFile(rankedDataLocation, JSON.stringify(newRanked), 'utf8', function(err) {
    //   if (err) {
    //     console.log(err);
    //   }
    // }); //will go to the file location that our data is at and change it

    //pulls the rank and timesSeen fields out of the object so it can be recognized by the deleteMovieObject function
    delete item.rank;
    delete item.timesSeen;
    this.deleteMovieObject(item);
    // watchlistMovieData = _.remove(item.movieName);
  },

  toggleAddMovieForm: function() { //this will pull up the form to add movies
    var tempVisibility = !this.state.movieFormVisible;
    this.setState({
      movieFormVisible: tempVisibility
    }); //setState
  }, //toggleAddMovieForm

  displayRanked: function() {
    rankedMovieData = JSON.parse(fs.readFileSync(rankedDataLocation));
    this.setState({
      myMovies: rankedMovieData,
      MovieListItem: RankedMovies,
      movieListTitle: rankedListTitle,
      sortFields: rankedSortFields,
      orderBy:'rank',
      orderDir:'asc',
      genre:'All', //reset genre on list change
      fileLocation: rankedDataLocation
    });
  },

  displayWatchlist: function() {
    watchlistMovieData = JSON.parse(fs.readFileSync(watchlistDataLocation));
    //if rank is being used to sort right now, change that because the watchlist doesn't use rank
    let orderBy = (this.state.orderBy == "rank") ? "movieName" : this.state.orderBy; //otherwise, stick with the sorting we were using
    this.setState({
      myMovies: watchlistMovieData,
      MovieListItem: WatchlistMovies,
      movieListTitle: watchlistTitle,
      sortFields: watchlistSortFields,
      orderBy: orderBy,
      genre:'All', //reset genre
      fileLocation: watchlistDataLocation
    });
  },

  searchMovies: function(query) { //query is what user typed into search bar
    this.setState({
      queryText: query
    });
  },

  ReOrder: function(orderBy, orderDir) { //will be sent either what to order by or the direction ot display
    this.setState({
      orderBy: orderBy,
      orderDir: orderDir
    });
  },

  onFilterGenre: function(genreChosen) {
    this.setState({
      genre: genreChosen
    });
  },

  showHelp: function() { //we want to display the show about on the toolbar
    console.log('we got an event call, we should now display!');
    ipc.sendSync('openInfoWindow'); //sends event notification to main process
  },

  render: function() {
    var myMovies = this.state.myMovies; //save that object to a variable that we can refer to and manipulate
    var queryText = this.state.queryText;
    var orderBy = this.state.orderBy;
    var orderDir = this.state.orderDir;
    var movieListTitle = this.state.movieListTitle;
    var sortFields = this.state.sortFields;

    return(
      //a basic way to show one of the movies in that dataset, will turn into a list
      <div className="application">
        <HeaderNav
          orderBy = {orderBy}
          orderDir = {orderDir}
          genre = {this.state.genre}
          onSearch = {this.searchMovies}
          onReOrder = {this.ReOrder}
          filterGenre = {this.onFilterGenre}
          sortFields = {sortFields}
          genreItems = {genreItems}
        />
        <div className="interface">
          <Toolbar
            handleAbout = {this.showHelp} //display the 'help' window */}
            handleToggle = {this.toggleAddMovieForm} //show the add movie form
            addMovie = {this.addMovieObject}
            displayRanked = {this.displayRanked}
            displayWatchlist = {this.displayWatchlist}
          />
          <div className="container">
            <MovieList
              movieListTitle = {movieListTitle}
              movieList = {myMovies}
              queryText = {queryText}
              orderBy = {orderBy}
              orderDir = {orderDir}
              genre = {this.state.genre}
              MovieListItem = {this.state.MovieListItem}
              deleteMovie = {this.deleteMovieObject}
              changeRank = {this.changeMovieRank}
              moveToFavorites = {this.moveMovieToFavorites}
              createMovieListFile = {this.writeMovieListToFile}
              addMoviesFromFile = {this.importMoviesFromFile}
              errorMovies = {this.state.errorMovies} //Need to get this to work
            />
          </div>{/* container */}
        </div>{/* interface */}
      </div>
    );//return
  } //render
}); //main interface


// inject the component into the div with ID = movieInfo
function renderMainInterface() {
  ReactDOM.render(
    <MainInterface />,
    document.getElementById('movieInfo')
  );
}

renderMainInterface();
