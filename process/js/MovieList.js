var React = require('React');
var _ = require('lodash');

var MovieList = React.createClass({
  filterMovies: function(movieList, queryText) {
    let filteredMovies = [];
    for(var i = 0; i < movieList.length; i++){ //filtering our movie list
      //we check if what they are typing matches anything in any of the movies, if it does, return that movie
      if((movieList[i].movieName.toLowerCase().indexOf(queryText) != -1) ||
        (movieList[i].directorName.toLowerCase().indexOf(queryText) != -1) ||
        (movieList[i].releaseDate.toLowerCase().indexOf(queryText) != -1) ||
        (movieList[i].Summary.toLowerCase().indexOf(queryText) != -1)){
          filteredMovies.push(movieList[i]);
      }
    }
    return filteredMovies;
  },

  sortMovies: function(movieList, orderBy, orderDir) {
    return _.orderBy(movieList, function(item){
      return item[orderBy].toLowerCase();
    }, orderDir); //uses Lodash to order the movies in the way that we want
  },

  renderListItems: function(movieList, deleteMovie, MovieListItem) {
    return movieList.map(function(item, index){ //send this data to MovieList to create a series of those tags
      return(
        <MovieListItem
          key = {index} //each index of the data.json file //TODO add to list item as an index
          singleItem = {item} //each item at that index
          onDelete = {deleteMovie}
          // onChangeRank = {this.changeRank}
        />
      ) //return
    }.bind(this));
  },

  render: function() {
    let {movieList, queryText, orderBy, orderDir, deleteMovie, MovieListItem} = this.props;

    movieList = this.filterMovies(movieList, queryText);

    movieList = this.sortMovies(movieList, orderBy, orderDir);

    movieList = this.renderListItems(movieList, deleteMovie, MovieListItem);

    return (
      <div className="row">
        <div className="movies col-sm-12">
          <h2 className="movies-headline">Ranked Movies</h2>
          <ul className="item-list media-list">{movieList}</ul>
        </div>
      </div>
    );
  }
});

module.exports = MovieList;
