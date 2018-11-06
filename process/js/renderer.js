//copy and paste libraries here
var $ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');

var fs = eRequire('fs');//eRequire to show that we are working with node now
var loadMovies = JSON.parse(fs.readFileSync(dataLocation));//Will go to the dataLocation defined in index.html and create a proper data file from the file there

var electron = eRequire('electron');
var ipc = electron.ipcRenderer;

var React = require('react');
var ReactDOM = require('react-dom');
var MovieList = require('./MovieList');
var Toolbar = require('./Toolbar');
var HeaderNav = require('./HeaderNav');
var AddMovie = require('./AddMovie');

//TODO functions to reload each piece of the page independently?

//TODO let's try to pull the toolbar out and see what happens how about that ya dickhead

//The main react component
var MainInterface = React.createClass({
  //this will load the retrieved data into an object for this component
  getInitialState: function(){
    return {
      movieBodyVisible: false,
      orderBy: 'movieName',
      orderDir: 'desc',
      queryText: '',
      myMovies: loadMovies
    } //return
  },

  //componentDidMount and componentWillUnmount handle all of the menu operation that we define in main.js
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
    fs.writeFile(dataLocation, JSON.stringify(this.state.myMovies), 'utf8', function(err){
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

    //TODO fuck this, change it, react-bootstrap
    if(this.state.movieBodyVisible === true){
      $('#addMovie').modal('show');
    } else {
      $('#addMovie').modal('hide');
    } //handles showing the modal for adding a movie

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
        <MovieList
          key = {index} //each index of the data.json file
          singleItem = {item} //each item at that index
          whichItem = {item}
          onDelete = {this.deleteMovie}
        />
      ) //return
    }.bind(this));

//INCOMP Need to be able to talk with the other files in order to populate the correct window
//want to be able to change the panel while keeping the search bar and toolbar.
//also need to change what is on the searchbar depending on which tab we are on

//TODO will need global event system in order to do intercomponent communication
  /* https://stackoverflow.com/questions/21285923/reactjs-two-components-communicating
     https://reactjs.org/docs/components-and-props.html */
    //Didn't have time today, but will look into it tomorrow
    //TODO will have to break this down into several components that can be re-rendered independenlty
    //TODO update filtered movies section in a more react way, re-render component for movielist
    return(
      //a basic way to show one of the movies in that dataset, will turn into a list
      <div className="application">
        <HeaderNav
          orderBy = {this.state.orderBy}
          orderDir = {this.state.orderDir}
          onSearch = {this.searchMovies}
          onReOrder = {this.ReOrder}
        />
        <div className="interface">
          <Toolbar
            handleAbout = {this.showAbout} //display the 'about' window
            handleToggle = {this.toggleMovieDisplay} //can pull down the modal
          />
          <AddMovie //this is for the modal that will appear
            handleToggle = {this.toggleMovieDisplay} //send an event to toggle the modal
            addMovie = {this.addMovieObject} //when submitted, send event notification
          />
          <div className="container">
           <div className="row">
             <div className="movies col-sm-12">
               <h2 className="movies-headline">Watched Movies</h2>
               <ul className="item-list media-list">{filteredMovies}</ul>
             </div>{/* col-sm-12 */}
           </div>{/* row */}
          </div>{/* container */}
        </div>{/* interface */}
      </div>
    );//return
  } //render
}); //main interface

//inject the component into the div with ID = movieInfo
function renderMainInterface(){
  ReactDOM.render(
    <MainInterface />,
    document.getElementById('movieInfo')
  );
}

renderMainInterface();

//===== Completely Separate Proof of Concept - stick a clock at the bottom, this is how I want to do things
function Clock(props) {
  return (
    <div>
      <h1>Hello Alex, Do Your Work!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('movieList')
  );
}
setInterval(tick, 1000);

// $(function(){
//   $('#movieInfo').append('<h3 class="text-success"> Movie Info Loaded </h3>')
// })
