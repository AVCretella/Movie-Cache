//copy and paste libraries here
var $ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');

//eRequire to show that we are working with node now
var fs = eRequire('fs');
//Will go to the dataLocation defined in index.html and create a proper data file from the file there
var loadMovies = JSON.parse(fs.readFileSync(dataLocation));



var React = require('react');
var ReactDOM = require('react-dom');
var MovieList = require('./MovieList')
//The main react component
var MainInterface = React.createClass({
  //this will load the retrieved data into an object for this component
  getInitialState: function(){
    return {
      myMovies: loadMovies
    } //return
  },
  componentDidUpdate: function(){
    fs.writeFile(dataLocation, JSON.stringify(this.state.myMovies), 'utf8', function(err){
      if(err){
        console.log(err);
      }
  }); //will go to the file location that our data is at and componentDidUpdate

  },
  deleteMovie: function(item){
    var allMovies = this.state.myMovies;
    var newMovies = _.without(allMovies, item); //return array without the one movie passed
    this.setState({
      myMovies: newMovies
    });
  },
  render: function(){
    var myMovies = this.state.myMovies; //save that object to a variable that we can refer to and manipulate
    myMovies = myMovies.map(function(item, index){ //send this data to MovieList to create a series of those tags
      return(
        <MovieList key = {index} //each index of the data.json file
          singleItem = {item} //each item at that index
          whichItem = {item}
          onDelete = {this.deleteMovie}
        />
      ) //return
    }.bind(this));
    return(
      //a basic way to show one of the movies in that dataset, will turn into a list
      <div className="application">
        <div className="container">
         <div className="row">
           <div className="movies col-sm-12">
             <h2 className="movies-headline">Watched Movies</h2>
             <ul className="item-list media-list">{myMovies}</ul>
           </div>{/* col-sm-12 */}
         </div>{/* row */}
        </div>{/* container */}
      </div>
    );
  }
});

//inject the component into the div with ID = movieInfo
ReactDOM.render(
  <MainInterface />,
  document.getElementById('movieInfo')
);

// $(function(){
//   $('#movieInfo').append('<h3 class="text-success"> Movie Info Loaded </h3>')
// })
