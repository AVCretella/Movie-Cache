//copy and paste libraries here
var $ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');

var fs = eRequire('fs');//eRequire to show that we are working with node now
var loadWatchlistMovies = JSON.parse(fs.readFileSync(watchlistDataLocation));//Will go to the dataLocation defined in index.html and create a proper data file from the file there
var loadRankedMovies = JSON.parse(fs.readFileSync(rankedDataLocation));//Will go to the dataLocation defined in index.html and create a proper data file from the file there
// var loadWatchlistMovies = require('../../data/watchlist_data.json');
// var loadRankedMovies = JSON.parse(fs.readFileSync(watchlistDataLocation));
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
// const Sidebar = require('./Sidebar.js');

// function BasicExample() {
//   return (
//     <Router>
//       <div>
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/about">About</Link>
//           </li>
//           <li>
//             <Link to="/topics">Topics</Link>
//           </li>
//         </ul>
//
//         <hr />
//
//         <Route exact path="/" component={Home} />
//         <Route path="/about" component={About} />
//         <Route path="/topics" component={Topics} />
//       </div>
//     </Router>
//   );
// }
//
// function Home() {
//   return (
//     <div>
//       <h2>Home</h2>
//     </div>
//   );
// }
//
// function About() {
//   return (
//     <div>
//       <h2>About</h2>
//     </div>
//   );
// }
//
// function Topics({ match }) {
//   return (
//     <div>
//       <h2>Topics</h2>
//       <ul>
//         <li>
//           <Link to={`${match.url}/rendering`}>Rendering with React</Link>
//         </li>
//         <li>
//           <Link to={`${match.url}/components`}>Components</Link>
//         </li>
//         <li>
//           <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
//         </li>
//       </ul>
//
//       <Route path={`${match.path}/:topicId`} component={Topic} />
//       <Route
//         exact
//         path={match.path}
//         render={() => <h3>Please select a topic.</h3>}
//       />
//     </div>
//   );
// }
//
// function Topic({ match }) {
//   return (
//     <div>
//       <h3>{match.params.topicId}</h3>
//     </div>
//   );
// }
//
// export default BasicExample;










// /*==============================================================================
//                             Header Interface
// ==============================================================================*/
// // //TODO let's try to pull the navbar out and see what happens how about that ya dickhead
// // var HeaderInterface = React.createClass({
// //   //this will load the retrieved data into an object for this component
// //   getInitialState: function(){
// //     return {
// //       movieBodyVisible: false,
// //       orderBy: 'movieName',
// //       orderDir: 'desc',
// //       queryText: '',
// //       myMovies: loadMovies
// //     } //return
// //   },
// //
// //   //componentDidMount and componentWillUnmount handle all of the menu operation that we define in main.js
// //   componentDidMount: function(){
// //     ipc.on('addMovie', function(event, message){
// //       this.toggleMovieDisplay();
// //     }.bind(this));
// //   }, //componentDidMount
// //
// //   componentWillUnmount: function(){
// //     ipc.removeListener('addMovie', function(event, message){
// //       this.toggleMovieDisplay();
// //     }.bind(this));
// //   }, //componentDidMount
// //
// //   componentDidUpdate: function(){
// //     fs.writeFile(dataLocation, JSON.stringify(this.state.myMovies), 'utf8', function(err){
// //       if(err){
// //         console.log(err);
// //       }
// //     }); //will go to the file location that our data is at and change it
// //   }, //componentDidUpdate
// //
// //   deleteMovie: function(item){
// //     var allMovies = this.state.myMovies;
// //     var newMovies = _.without(allMovies, item); //return array without the one movie passed
// //     this.setState({
// //       myMovies: newMovies
// //     });
// //   },
// //
// //   toggleMovieDisplay: function(){ //this will allow us to add a movie to a list
// //     var tempVisibility = !this.state.movieBodyVisible;
// //     this.setState({
// //       movieBodyVisible: tempVisibility
// //     }); //setState
// //   }, //toggleMovieDisplay
// //
// //   addMovieObject: function(tempItem){ //receives object saves in form
// //     var tempMovies = this.state.myMovies;
// //     tempMovies.push(tempItem);
// //     this.setState({
// //       myMovies: tempMovies,
// //       movieBodyVisible: false
// //     });
// //   },
// //
// //   searchMovies: function(query){ //query is what user typed into search bar
// //     this.setState({
// //       queryText: query
// //     });
// //   },
// //
// //   ReOrder: function(orderBy, orderDir){ //will be sent either what to order by or the direction ot display
// //     this.setState({
// //       orderBy: orderBy,
// //       orderDir: orderDir
// //     });
// //   },
// //
// //   showAbout: function(){ //we want to display the show about on the toolbar
// //     ipc.sendSync('openInfoWindow'); //sends event notification to main process
// //   },
// //
// //   render: function(){
// //     var myMovies = this.state.myMovies; //save that object to a variable that we can refer to and manipulate
// //     var queryText = this.state.queryText;
// //     var orderBy = this.state.orderBy;
// //     var orderDir = this.state.orderDir;
// //     var filteredMovies = [];
// //
// //     //TODO fuck this, change it, react-bootstrap
// //     if(this.state.movieBodyVisible === true){
// //       $('#addMovie').modal('show');
// //     } else {
// //       $('#addMovie').modal('hide');
// //     } //handles showing the modal for adding a movie
// //
// //     for(var i = 0; i < myMovies.length; i++){ //filtering our movie list
// //       //we check if what they are typing matches anything in any of the movies, if it does, return that movie
// //       if((myMovies[i].movieName.toLowerCase().indexOf(queryText) != -1) ||
// //         (myMovies[i].directorName.toLowerCase().indexOf(queryText) != -1) ||
// //         (myMovies[i].releaseDate.toLowerCase().indexOf(queryText) != -1) ||
// //         (myMovies[i].Summary.toLowerCase().indexOf(queryText) != -1)){
// //           filteredMovies.push(myMovies[i]);
// //       }
// //     }
// //
// //     filteredMovies = _.orderBy(filteredMovies, function(item){
// //       return item[orderBy].toLowerCase();
// //     }, orderDir); //uses Lodash to order the movies in the way that we want
// //
// //     filteredMovies = filteredMovies.map(function(item, index){ //send this data to MovieList to create a series of those tags
// //       return(
// //         <MovieList
// //           key = {index} //each index of the data.json file
// //           singleItem = {item} //each item at that index
// //           whichItem = {item}
// //           onDelete = {this.deleteMovie}
// //         />
// //       ) //return
// //     }.bind(this));
// //
// //     return(
// //       //a basic way to show one of the movies in that dataset, will turn into a list
// //       <div className="application">
// //         <HeaderNav
// //           orderBy = {this.state.orderBy}
// //           orderDir = {this.state.orderDir}
// //           onSearch = {this.searchMovies}
// //           onReOrder = {this.ReOrder}
// //         />
// //       </div>
// //     );//return
// //   } //render
// // }); //main interface
// //
// //
//



// //TODO will turn this into just the changing panel with lists of Movies
// //TODO need to break this big component into smaller components
/*==============================================================================
                            Main Interface Ranked
==============================================================================*/
var MainInterfaceRanked = React.createClass({
  //this will load the retrieved data into an object for this component
  getInitialState: function(){
    return {
      movieBodyVisible: false,
      orderBy: 'rank',
      orderDir: 'asc',
      queryText: '',
      myMovies: loadRankedMovies
    } //return
  },

  //componentDidMount and componentWillUnmount handle all of the menu operations that we define in main.js
  componentDidMount: function(){
    ipc.on('addMovie', function(event, message){
      this.toggleMovieDisplay();
    }.bind(this));
  }, //componentDidMount

  componentWillUnmount: function(){
    ipc.removeListener('addMovie', function(event, message){
      this.toggleMovieDisplay();
    }.bind(this));
  }, //componentDidMount

  componentDidUpdate: function(){
    fs.writeFile(rankedDataLocation, JSON.stringify(this.state.myMovies), 'utf8', function(err){
      if(err){
        console.log(err);
      }
    }); //will go to the file location that our data is at and change it
  }, //componentDidUpdate

  deleteMovie: function(item){
    var allMovies = this.state.myMovies;
    var newMovies = _.without(allMovies, item); //return array without the one movie passed
    this.setState({
      myMovies: newMovies
    });
  },

  toggleMovieDisplay: function(){ //this will allow us to add a movie to a list
    var tempVisibility = !this.state.movieBodyVisible;
    this.setState({
      movieBodyVisible: tempVisibility
    }); //setState
  }, //toggleMovieDisplay

  addMovieObject: function(tempItem){ //receives object saves in form
    var tempMovies = this.state.myMovies;
    tempMovies.push(tempItem);
    this.setState({
      myMovies: tempMovies,
      movieBodyVisible: false
    });
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

  showAbout: function(){ //we want to display the show about on the toolbar
    ipc.sendSync('openInfoWindow'); //sends event notification to main process
  },

  render: function(){
    var myMovies = this.state.myMovies; //save that object to a variable that we can refer to and manipulate
    var queryText = this.state.queryText;
    var orderBy = this.state.orderBy;
    var orderDir = this.state.orderDir;
    var filteredMovies = [];

    for(var i = 0; i < myMovies.length; i++){ //filtering our movie list
      //we check if what they are typing matches anything in any of the movies, if it does, return that movie
      if((myMovies[i].movieName.toLowerCase().indexOf(queryText) != -1) ||
        (myMovies[i].directorName.toLowerCase().indexOf(queryText) != -1) ||
        (myMovies[i].releaseDate.toLowerCase().indexOf(queryText) != -1) ||
        (myMovies[i].Summary.toLowerCase().indexOf(queryText) != -1)){
          filteredMovies.push(myMovies[i]);
      }
    }

    filteredMovies = _.orderBy(filteredMovies, function(item){
      return item[orderBy].toLowerCase();
    }, orderDir); //uses Lodash to order the movies in the way that we want

    filteredMovies = filteredMovies.map(function(item, index){ //send this data to MovieList to create a series of those tags
      return(
        <RankedMovies
          key = {index} //each index of the data.json file
          singleItem = {item} //each item at that index
          whichItem = {item}
          onDelete = {this.deleteMovie}
          // onChangeRank = {this.changeRank}
        />
      ) //return
    }.bind(this));

    let sortFields = [
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
            handleAbout = {this.showAbout} //display the 'about' window
            handleToggle = {this.toggleMovieDisplay} //can pull down the modal
          />
          <div className="container">
           <div className="row">
             <div className="movies col-sm-12">
               <h2 className="movies-headline">Ranked Movies</h2>
               <ul className="item-list media-list">{filteredMovies}</ul>
             </div>{/* col-sm-12 */}
           </div>{/* row */}
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

// function renderMainInterfaceWatchlist(){
//   ReactDOM.render(
//     <MainInterfaceWatchlist />,
//     document.getElementById('movieInfo')
//   );
// }

// var displayRanked = 1
// if(displayRanked){
//   renderMainInterface();
// } else {
//   renderMainInterfaceWatchlist();
// }
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

renderClock();
//
// function App(){
//   return (
//     <div>
//       <Clock />
//       <Clock />
//       <Clock />
//       <Clock />
//     </div>
//   );
// }
//
// function render4Clock(){
//   ReactDOM.render(
//     <App />,
//     document.getElementById('movieList')
//   );
// }
//
// render4Clock();
// /*==============================================================================
//                             HighLightControl For Toolbar
// ==============================================================================*/
class HighLightControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleRankedClick = this.handleRankedClick.bind(this);
    this.handleWatchlistClick = this.handleWatchlistClick.bind(this);
    this.state = {displayRanked: false};
  }

  handleRankedClick() {
    this.setState({displayRanked: true});
  }

  handleWatchlistClick() {
    this.setState({displayRanked: false});
  }

  render() {
    const displayRanked = this.state.displayRanked;
    let button;

    if (displayRanked) {
      console.log("display ranked")
      button = <RankedMovies onClick={this.handleRankedClick} />;
    } else {
      button = <WatchlistMovies onClick={this.handleWatchlistClick} />;
    }

    return (
      <div>
        <DisplayMovies displayRanked={displayRanked} />
        {button}
      </div>
    );
  }
}

function highlightChosenList(){
  ReactDOM.render(
    <HighLightControl />,
    document.getElementById('whichList')
  );
}
highlightChosenList();


function RankedMovies(props) {
  return <h1>We should be displaying Ranked Movies</h1>;
}

function WatchlistMovies(props) {
  return <h1>We should be displaying Watch Later Movies</h1>;
}

function DisplayMovies(props) {
  const displayRanked = props.displayRanked;
  if (displayRanked) {
    return <RankedMovies />;
  }
  else{
    return <WatchlistMovies />;
  }
}

function renderMovieList(){
  ReactDOM.render(
    // Try changing to isLoggedIn={true}:
    <DisplayMovies displayRanked={true} />,
    document.getElementById('moviesToDisplay')
  );
}
renderMovieList();
