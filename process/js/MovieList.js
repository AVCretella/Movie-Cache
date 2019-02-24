var React = require('React');
var _ = require('lodash');

var MovieList = React.createClass({
  getInitialState: function(){
    return{
      isMoviesNotAddedModalVisible: false
    }
  },

  //TODO really crappy search, but not the focus rn, and complexity isn't huge because lists will only be so big
  filterMovies: function(movieList, queryText) {
    // console.log("this is the query text: ", queryText);
    let filteredMovies = [];

    //we check if what they are typing matches anything in any of the movies, if it does, return that movie
    //TODO this is case sensitive at the moment, should it be?
            //can use .toLowerCase() but that isn't how things are matched
    for(var i = 0; i < movieList.length; i++){ //filtering our movie list
      if((movieList[i].movieName.indexOf(queryText) != -1) ||
        (movieList[i].actors.includes(queryText)) || //check the actors array has an actor
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
    // console.log("this is genre rn: ", this.props.genre);
    if (this.props.genre != 'All') {
      newMovies = newMovies.filter((movie) =>
        movie.genres.includes(this.props.genre)
      );
    }
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

  //sends the list that is currently being shown so we know what to add to
  //actually i can just check the state of the main component for that
  importList: function(movieList){
    this.props.addMoviesFromFile(this.props.movieListTitle);
    console.log("Button Pressed!!!!!!!!!!!!!");

    console.log("Sending ", this.props.movieListTitle, " to the renderer process");
    //make sure to check they've uploaded the correct file - says ranked or watchlist

    //TODO want to wait for the API calls to be done and then pop up a modal with the movies that weren't added
  },

  moveRankUp: function(item) {
    console.log(this.props.movieList);
    sortedMovies = this.sortMovies(this.props.movieList, this.props.orderBy, this.props.orderDir);
    let indexMovieToChange = _.indexOf(sortedMovies, item);
    console.log("TRYING TO GO UP");
    console.log("this is the index of the movie that we clicked: ", indexMovieToChange);
    if (indexMovieToChange != 0) {
      item.rank = (this.props.movieList[indexMovieToChange - 1].rank - - .01).toFixed(2);
      this.props.changeRank(item);
    }
  },

  moveRankDown: function(item) {
    console.log(this.props.movieList);
    sortedMovies = this.sortMovies(this.props.movieList, this.props.orderBy, this.props.orderDir);
    let indexMovieToChange = _.indexOf(sortedMovies, item);
    console.log("TRYING TO GO DOWN");
    console.log("this is the index of the movie that we clicked: ", indexMovieToChange);
    item.rank = (this.props.movieList[indexMovieToChange + 1].rank - .01).toFixed(2);
    this.props.changeRank(item);
  },

  renderListItems: function(movieList, orderBy, deleteMovie, changeRank, moveToFavorites, MovieListItem) {
    return movieList.map(function(item, index){ //send this data to MovieList to create a series of those tags
      return(
        <MovieListItem
          key = {index} //each index of the data.json file
          singleItem = {item} //each item at that index
          sortField = {orderBy}
          onDelete = {deleteMovie} //calls the deleteMovie function in renderer.js
          onChangeRank = {changeRank} //calls the changeRank function in renderer.js
          onMoveToFavorites = {moveToFavorites} //calls the moveToFavorites function in renderer.js
          onRankUp = {this.moveRankUp}
          onRankDown = {this.moveRankDown}
        />
      ) //return
    }.bind(this));
  },

  render: function() {
    let {movieListTitle, movieList, queryText, orderBy, orderDir, deleteMovie, changeRank, moveToFavorites, MovieListItem} = this.props;

    if (movieListTitle == "Watchlist") {
      importButton =  <span className="pull-right import">
                        <button className="btn btn-med btn-info" title="Import a movie list .csv from file" onClick={this.importList}>
                        <span className="glyphicon glyphicon-open"></span></button>
                      </span>
    } else {
      importButton = <div></div>;
    }

    movieList = this.filterMovies(movieList, queryText);
    movieList = this.sortMovies(movieList, orderBy, orderDir);
    movieList = this.renderListItems(movieList, orderBy, deleteMovie, changeRank, moveToFavorites, MovieListItem);
    console.log("this is movieList after it is all rendered: ", movieList);

    return (
      <div className="row">
        <div className="movies col-sm-12">

          <div>
            <h2 className="movies-headline">{movieListTitle}</h2>

            {/* Button to export the ranked and wish lists*/}
            <span className="pull-right export">
              <button className="btn btn-med btn-info" title="Export this list to a file" onClick={this.exportList}>
              <span className="glyphicon glyphicon-save"></span></button>
            </span>

            {/* Button to import the movies. TODO will need to be able to identify whether it is a csv (to convert to object form for watchlist) or if it already in object form) */}
            {importButton}
          </div>

          <ul className="item-list media-list">{movieList}</ul>
        </div>
      </div>
    );
  }
});

module.exports = MovieList;
