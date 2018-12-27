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
        (movieList[i].releaseDate.indexOf(queryText) != -1) ||
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
  */
  sortMovies: function(movieList, orderBy, orderDir) {
    return _.orderBy(movieList, item => item[orderBy], orderDir);
  },

  renderListItems: function(movieList, deleteMovie, changeRank, MovieListItem) {
    return movieList.map(function(item, index){ //send this data to MovieList to create a series of those tags
      return(
        <MovieListItem
          key = {index} //each index of the data.json file //TODO add to list item as an index
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
          <h2 className="movies-headline">{movieListTitle}</h2>
          <ul className="item-list media-list">{movieList}</ul>
        </div>
      </div>
    );
  }
});

module.exports = MovieList;
