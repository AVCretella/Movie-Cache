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
  },

  //sends the list that is currently being shown so we know what to add to
  //actually i can just check the state of the main component for that
  importList: function(movieList){
    if(this.props.addMoviesFromFile(this.props.movieListTitle)){ //tell renderer which list to add this file to
      console.log(":::::::::::::::::::::::::::shit it's already true");
    }

    console.log("exporting ", this.props.movieListTitle);
    console.log("this is the movies that had erorrs: ", this.props.errorMovies);//TODO get this too quickly, need to be passed the list that we just made
    //TODO want to wait for the API calls to be done and then pop up a modal with the movies that weren't added
  },

//TODO the rendere process should handle this
  adjustRanksAndDelete: function(item) {
    console.log(this.props.movieList);
    // var sortedMovies = _.orderBy(this.props.movieList, ['rank'], ['asc']);
    // console.log("these are the movies in rank order", sortedMovies);
    // let startIndex = item.rank - 1; //index of movie being removed in the movieList
    // for (currentIndex = startIndex; currentIndex <= sortedMovies.length; currentIndex++) {
    //   this.props.movieList[currentIndex][rank] = this.props.movieList[currentIndex][rank] - 1;
    // }
    this.props.deleteMovie(item);
  },

  //Rather than just changing the rank, which was easy before, making everything complicated by working directly with the orders
  // moveRankUp: function(item) {
  //   let sortedMovies = this.sortMovies(this.props.movieList, this.props.orderBy, this.props.orderDir);
  //   console.log("sortedMovies: ", sortedMovies);
  //   let indexMovieToChange = _.indexOf(sortedMovies, item);
  //   console.log("TRYING TO GO UP");
  //   console.log("this is the index of the movie that we clicked: ", indexMovieToChange);
  //   if (indexMovieToChange != 0) {
  //     item.rank = parseFloat((sortedMovies[indexMovieToChange - 1].rank - - .01).toFixed(2)); //TODO should actually cast to int, keep to make ed the happy. (he does not want blame though if not the working goodly)
  //     this.props.changeRank(item);
  //   }
  // },
  //
  // moveRankDown: function(item) {
  //   let sortedMovies = this.sortMovies(this.props.movieList, this.props.orderBy, this.props.orderDir);
  //   console.log("sortedMovies: ", sortedMovies);
  //
  //   let indexMovieToChange = _.indexOf(sortedMovies, item);
  //   console.log("TRYING TO GO DOWN");
  //   console.log("this is the index of the movie that we clicked: ", indexMovieToChange);
  //   if (indexMovieToChange - 1 != sortedMovies.length) {
  //     item.rank = parseFloat((sortedMovies[indexMovieToChange + 1].rank - .01).toFixed(2));
  //     this.props.changeRank(item);
  //   }
  // },

  moveRankByOne: function(oldRank, newRank) {
    console.log("newrank: ", newRank, " and old: ", oldRank);
    if (newRank != 0 && newRank != this.props.movieList.length + 1) {
      this.props.changeRank(oldRank, newRank);
    }
  },

  calculateHoursRanked: function(movieList) {
    let totalHours = 0;
    movieList.forEach( function(movie, idx,movieList){
      totalHours += (movie.duration * movie.viewCount);
    });
    return (totalHours / 60).toFixed(2);
  },

  calculateHoursWatchlist: function(movieList) {
    let totalHours = 0;
    movieList.forEach( function(movie, idx,movieList){
      totalHours += movie.duration;
    });
    return (totalHours / 60).toFixed(2);
  },

  renderListItems: function(movieList, orderBy, deleteMovie, changeRank, changePersonalRating, moveToFavorites, showTrailer, MovieListItem) {
    return movieList.map(function(item, index){ //send this data to MovieList to create a series of those tags
      return(
        <MovieListItem
          key = {index} //each index of the data.json file
          singleItem = {item} //each item at that index
          sortField = {orderBy}
          onDelete = {this.adjustRanksAndDelete} //calls the deleteMovie function in renderer.js
          onChangeRank = {changeRank} //calls the changeRank function in renderer.js
          onChangePersonalRating = {changePersonalRating}
          onMoveToFavorites = {moveToFavorites} //calls the moveToFavorites function in renderer.js
          onViewTrailer = {showTrailer} //pull up the trailer of the movie being clicked in a separate window
          onMoveRankByOne = {this.moveRankByOne}
        />
      ) //return
    }.bind(this));
  },

  render: function() {
    let {movieListTitle, movieList, queryText, orderBy, orderDir, deleteMovie, changeRank, changePersonalRating, moveToFavorites, showTrailer, MovieListItem} = this.props;

    if (movieListTitle == "Watchlist") {
      let hoursWatchlist = this.calculateHoursWatchlist(movieList);
      timeWatching =  <span className="pull-right import">
                        <span>Hours needed to watch all of these movies: {hoursWatchlist}</span>
                      </span>;
      importButton =  <span className="pull-right import">
                        <button className="btn btn-med btn-info" title="Import a movie list .csv from file" onClick={this.importList}>
                        <span className="glyphicon glyphicon-open"/></button>
                      </span>;
    } else {
      let hoursRanked = this.calculateHoursRanked(movieList);
      timeWatching =  <span className="pull-right">
                        <span>Time Spent Watching Favorite Movies: {hoursRanked}</span>
                      </span>;
      // importButton =  <span className="pull-right"/>;
      importButton =  <span className="pull-right import">
                        <button className="btn btn-med btn-info" title="Import a movie list .csv from file" onClick={this.importList}>
                        <span className="glyphicon glyphicon-open"/></button>
                      </span>;
    }

    movieList = this.filterMovies(movieList, queryText);
    movieList = this.sortMovies(movieList, orderBy, orderDir);
    movieList = this.renderListItems(movieList, orderBy, deleteMovie, changeRank, changePersonalRating, moveToFavorites, showTrailer, MovieListItem);

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

            {importButton}

            {timeWatching}
          </div>

          <ul className="item-list media-list">{movieList}</ul>
        </div>
      </div>
    );
  }
});

module.exports = MovieList;
