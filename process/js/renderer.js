//copy and paste libraries here
var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var _ = require('lodash');

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
// const Sidebar = require('./Sidebar.js');

/*==============================================================================
                            Main Interface Ranked
==============================================================================*/
//TODO maybe change ranked list to 'ranked' list
//These are the fields that will populate the search bar when a specific list is being displayed
let rankedSortFields = [
  {
    field: "movieName",
    displayName: "Movie Name"
  },
  {
    field: "releaseDate",
    displayName: "Release Date"
  },
  {
    field: "directorName",
    displayName: "Director"
  },
  {
    field: "rank",
    displayName: "Rank"
  }
];

let watchlistSortFields = [
  {
    field: "movieName",
    displayName: "Movie Name"
  },
  {
    field: "releaseDate",
    displayName: "Release Date"
  },
  {
    field: "directorName",
    displayName: "Director"
  }
];

var MainInterfaceRanked = React.createClass({
  //this will load the retrieved data into an object for this component
  getInitialState: function(){
    return {
      movieFormVisible: false,
      orderBy: 'rank',
      orderDir: 'desc',
      queryText: '',
      myMovies: rankedMovieData,
      MovieListItem: RankedMovies,
      movieListTitle: "Favorite Movies",
      sortFields: rankedSortFields,
      fileLocation: rankedDataLocation
    } //return
  },

  //componentDidMount and componentWillUnmount handle all of the menu operations that we define in main.js
  componentDidMount: function(){
    ipc.on('addMovie', function(event, message){
      this.toggleAddMovieForm();
    }.bind(this));
  }, //componentDidMount

  componentWillUnmount: function(){
    ipc.removeListener('addMovie', function(event, message){
      this.toggleAddMovieForm();
    }.bind(this));
  }, //componentDidMount

  componentDidUpdate: function(){
    fs.writeFile(this.state.fileLocation, JSON.stringify(this.state.myMovies), 'utf8', function(err){
      if(err){
        console.log(err);
      }
    }); //will go to the file location that our data is at and change it
  }, //componentDidUpdate

  toggleAddMovieForm: function(){ //this will pull up the form to add movies
    var tempVisibility = !this.state.movieFormVisible;
    this.setState({
      movieFormVisible: tempVisibility
    }); //setState
  }, //toggleAddMovieForm

  displayRanked: function(){
    rankedMovieData = JSON.parse(fs.readFileSync(rankedDataLocation));
    this.setState({
      myMovies: rankedMovieData,
      MovieListItem: RankedMovies,
      movieListTitle: "Favorite Movies",
      sortFields: rankedSortFields,
      orderBy:'rank',
      orderDir:'desc',
      fileLocation: rankedDataLocation
    });
  },

  displayWatchlist: function(){
    watchlistMovieData = JSON.parse(fs.readFileSync(watchlistDataLocation));
    //if rank is being used to sort right now, change that because the watchlist doesn't use rank
    let orderBy = (this.state.orderBy == "rank") ? "movieName" : this.state.orderBy;
    this.setState({
      myMovies: watchlistMovieData,
      MovieListItem: WatchlistMovies,
      movieListTitle: "Watchlist Movies",
      sortFields: watchlistSortFields,
      orderBy: orderBy,
      fileLocation: watchlistDataLocation
    });
  },

  addMovieObject: function(tempItem){ //receives object saves in form
    var tempMovies = this.state.myMovies;
    tempMovies.push(tempItem);
    this.setState({
      myMovies: tempMovies
    });
    console.log("MY MOVIES: ", this.myMovies);
  },

  deleteMovieObject: function(item){
    console.log("We should have deleted this movie: ", item);
    var allMovies = this.state.myMovies;
    var newMovies = _.without(allMovies, item); //return array without the one movie passed
    console.log("ALL MOVIES: ", allMovies);
    this.setState({
      myMovies: newMovies
    });
    console.log("NEW MOVIES: ", newMovies);
    console.log("MY MOVIES: ", this.myMovies);
  },

  searchMovies: function(query){ //query is what user typed into search bar
    this.setState({
      queryText: query
    });
  },

  ReOrder: function(orderBy, orderDir){ //will be sent either what to order by or the direction ot display
    this.setState({
      orderBy: orderBy,
      orderDir: orderDir
    });
  },

  showHelp: function(){ //we want to display the show about on the toolbar
    console.log('we got an event call, we should now display!');
    ipc.sendSync('openInfoWindow'); //sends event notification to main process
  },

  render: function(){
    var myMovies = this.state.myMovies; //save that object to a variable that we can refer to and manipulate
    var queryText = this.state.queryText;
    var orderBy = this.state.orderBy;
    var orderDir = this.state.orderDir;
    var movieListTitle = this.state.movieListTitle;
    var sortFields = this.state.sortFields;

    console.log(this.state);

    return(
      //a basic way to show one of the movies in that dataset, will turn into a list
      <div className="application">
        <HeaderNav
          orderBy = {this.state.orderBy}
          orderDir = {this.state.orderDir}
          onSearch = {this.searchMovies}
          onReOrder = {this.ReOrder}
          sortFields = {sortFields}
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
              deleteMovie = {this.deleteMovieObject}
              MovieListItem = {this.state.MovieListItem}
            />
          </div>{/* container */}
        </div>{/* interface */}
      </div>
    );//return
  } //render
}); //main interface


// inject the component into the div with ID = movieInfo
function renderMainInterface(){
  ReactDOM.render(
    <MainInterfaceRanked />,
    document.getElementById('movieInfo')
  );
}

renderMainInterface();


// function renderHeaderNav(){
//   ReactDOM.render(
//     <TestHeaderInterface />
//     document.getElementById('headerNav')
//   );
// }
//
// renderHeaderNav();





// function renderHeaderNav(){
//   ReactDOM.render(
//     <HeaderInterface />
//     document.getElementById('application')
//   );
// }
//
// renderHeaderNav();




//===== Completely Separate Proof of Concept - stick a clock at the bottom, this is how I want to do things
// function Clock(props) {
//   return (
//     <div>
//       <h1>Hello Alex, Do Your Work!</h1>
//       <h2>It is {props.date.toLocaleTimeString()}.</h2>
//     </div>
//   );
// }

//changing clock function into a function component
//This is what an actual component looks like from the React Tutorial
class Clock extends React.Component{
  constructor(props){
    super(props);
    this.state = {date: new Date()}; //turns date into a component state
  }

  componentDidMount(){
    this.timerID = setInterval(
      () => this.tick(), 1000
    );
  }

  componentWillUnmount(){
    clearInterval(this.timerID);
  }

  tick(){
    this.setState({ //setState is the only way to update the state once out of the constructor
      date: new Date()
    });
  }

  render(){
    return(
      <div>
        <h1>Hello Alex, Do Your Work!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    )
  }
}

function renderClock(){
  ReactDOM.render(
    <Clock />,
    document.getElementById('movieList')
  );
}

// renderClock();
