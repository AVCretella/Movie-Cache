var React = require('React');
var _ = require('lodash');

var MovieList = React.createClass({
  filterMovies: function(movieList, queryText) {
    console.log("this is the query text: ", queryText);
    let filteredMovies = [];
    for(var i = 0; i < movieList.length; i++){ //filtering our movie list
      //we check if what they are typing matches anything in any of the movies, if it does, return that movie
      //TODO this is case sensitive at the moment, should it be?
      //can use .toLowerCase() but that isn't how things are matched
      if((movieList[i].movieName.indexOf(queryText) != -1) ||
        (movieList[i].directorName.indexOf(queryText) != -1) ||
        (movieList[i].releaseDate == queryText) ||
        (movieList[i].Summary.indexOf(queryText) != -1)){
          filteredMovies.push(movieList[i]);
      }
    }
    return filteredMovies;
  },

  //Takes the list of movies and orders it however the user has dictated
  /*
    This method assumes that numbers are stored as integers, not strings because
    ints as strings are treated differently by Lodash than ints

    //TODO want to add a relativeRank. like 1,2,3,4,5,.. for each of the movies
    //if we just assume that we need to put the values here, we can keep the same values When
    //movies are being tossed around by other filtering and whatever. This will only care about the rank a person gave
  */
  sortMovies: function(movieList, orderBy, orderDir) {
    let newMovies = _.orderBy(movieList, item => item[orderBy], orderDir);
    //TODO need to map a different number to a new field for every movie
    //TODO need to worry about this when adding and removing movies too, maybe need another function
    // var newerMovies = _.map(newMovies, function(element) {
    //  return _.extend({}, element, {relativeRank: 1});
    // });
    return newMovies;
  },

  exportList: function(movieList){
    this.props.createMovieListFile(this.props.movieListTitle);
    console.log("Sending ", this.props.movieListTitle, " to the renderer process");
  },

  // importList: function(movieList){
  //   //TODO Need to allow users to upload file
  //
  //   //get the file from user system
  //
  //   //parse into necessary components
  //
  //   //send object to renderer to add to the existing list
  //
  //   // this.props.addMoviesFromFile{this.props.movieListTitle});
  //   //make sure to check they've uploaded the correct file - says ranked or watchlist
  //   console.log("Trying to upload a file");
  // },

  renderListItems: function(movieList, deleteMovie, changeRank, MovieListItem) {
    return movieList.map(function(item, index){ //send this data to MovieList to create a series of those tags
      return(
        <MovieListItem
          key = {index} //each index of the data.json file
          singleItem = {item} //each item at that index
          onDelete = {deleteMovie}
          onChangeRank = {changeRank}
        />
      ) //return
    }.bind(this));
  },

  render: function() {
    let {movieListTitle, movieList, queryText, orderBy, orderDir, deleteMovie, changeRank, MovieListItem} = this.props;

    movieList = this.filterMovies(movieList, queryText);

    movieList = this.sortMovies(movieList, orderBy, orderDir);

    movieList = this.renderListItems(movieList, deleteMovie, changeRank, MovieListItem);
    return (
      <div className="row">
        <div className="movies col-sm-12">

          <div>
            <h2 className="movies-headline">{movieListTitle}</h2>

            {/* Button to export the ranked and wish lists*/}
            <span className="pull-right export">
              <button className="btn btn-med btn-info" onClick={this.exportList}>
              <span className="glyphicon glyphicon-download"></span></button>
            </span>

            {/*
            <span className="pull-right import">
              <button className="btn btn-med btn-info" onClick={this.importList}>
              <span className="glyphicon glyphicon-upload"></span></button>
            </span>
            */}
          </div>

          <ul className="item-list media-list">{movieList}</ul>
        </div>
      </div>
    );
  }
});

module.exports = MovieList;
