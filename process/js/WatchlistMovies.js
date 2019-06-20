//Creates the list of movies that are in data.json
//In the future, we will be pulling from a database, not a data.json file
var React = require('react');

var WatchlistMovies = React.createClass({
  getInitialState: function(){
    return{
      moveModalVisible: false
    }
  },

  viewTrailer: function(){ //send the name to the renderer and it'll open a window with the youtube link
    this.props.onViewTrailer(this.props.singleItem.movieName);
  },

  removeFromList: function(){
    this.props.onDelete(this.props.singleItem); //lets the function know which movie has been selected for deletion
  },

  //Open the 'move to favorites' modal if not open already, close if it is
  toggleMoveMovieDisplay: function(){
    var tempVisibility = !this.state.moveModalVisible;
    this.setState({
      moveModalVisible: tempVisibility
    }); //setState
    this.moveMovieFormRef.reset();
  },

  //Takes new rank and viewCount, sends move data to the renderer, closes the 'move to favorites' modal
  moveToFavorites: function(submitEvent){
    submitEvent.preventDefault();

    var tempItem = this.props.singleItem;
    tempItem.viewCount = this.inputTimesSeen.value;
    tempItem.rank = parseFloat(this.inputMovieRank.value);
    tempItem.personalRating = parseFloat(this.inputMoviePersonalRating.value);
    // var rank = this.inputMovieRank.value
    // console.log("this is the rank with parse: ", tempItem.rank );
    // console.log("this is without, : ", rank);
    //
    // console.log("trying to move movie", this.props.singleItem.rank);
    this.props.onMoveToFavorites(tempItem);

    this.toggleMoveMovieDisplay();
    this.moveMovieFormRef.reset();

    //TODO probably want a callback for this so that we dont delete it and then not end up moving, like if someone changes their mind
    // this.props.onDelete(this.props.singleItem); //lets the function know which movie has been selected for deletion
  },

  render: function(){

    let style, className;
    if (this.state.moveModalVisible) {
      className = "modal fade in";
      style = {
        display: "block",
        paddingLeft: "0px"
      };
    } else {
      className = "modal fade";
      style = {
        display: "none"
      };
    }

    if(this.props.singleItem.posterURL != 'N/A'){
      moviePoster = <div className="col-sm-2">
                      <div className="movie-poster">
                        <img src={this.props.singleItem.posterURL} style={{width: '100%', height: '100%'}} alt="[ Movie Poster Unavailable ]"></img>
                      </div>
                    </div>
    } else {
      moviePoster = <div className="col-sm-2">
                      <div className="movie-poster">
                        <img src={this.props.singleItem.posterURL} style={{width: '100%', height: '100%'}} alt="[ Movie Poster Unavailable ]"></img>
                      </div>
                    </div>
    }

    return(
      <div>
        {/* Modal for the changerank functionality */}
        <div className={className} id="changeRank" tabIndex="-1" role="dialog" style = {style}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="submit" className="close" onClick={this.toggleMoveMovieDisplay} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">Move &quot;{this.props.singleItem.movieName}&quot; To Your Favorites List</h4>
              </div>

              <form className="modal-body add-movie form-horizontal" ref={(ref) => this.moveMovieFormRef = ref} onSubmit={this.moveToFavorites}>
                <div className="form-group">
                  <label className="col-sm-10 control-label" htmlFor="rank">Your Rating for &quot;{this.props.singleItem.movieName}&quot;</label>
                  <div className="col-sm-2">
                    <input type="number" min="0" step=".1" className="form-control" placeholder="9.4"
                      id="personal-rating" ref={(ref) => this.inputMoviePersonalRating = ref}/>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-10 control-label" htmlFor="rank">Rank on Your Favorites List</label>
                  <div className="col-sm-2">
                    <input type="number" min="1" className="form-control" placeholder="15"
                      id="rank" ref={(ref) => this.inputMovieRank = ref}/>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-10 control-label" htmlFor="timesSeen">How many times have you seen &quot;{this.props.singleItem.movieName}&quot;?</label>
                  <div className="col-sm-2">
                    <input type="number" step="1" min="1" max="100" className="form-control" placeholder="1"
                      id="timesSeen" ref={(ref) => this.inputTimesSeen = ref}/>
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-sm-offset-3 col-sm-9">
                    <div className="pull-right">
                      {/*<button type="submit" className="btn btn-default" onClick={this.toggleRankDisplay}>Cancel</button>&nbsp;*/}
                      <button type="submit" className="btn btn-success">Move To Favorites List</button>
                    </div>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>


        <li className="movie-item media">

          {/*where the poster will be displayed*/}
          {moviePoster}
          {/*<div className="col-sm-2">
            <div className="movie-poster">
              <img src={this.props.singleItem.posterURL} style={{width: '100%', height: '100%'}} alt="[ Movie Poster Unavailable ]"></img>
            </div>
          </div>*/}

          {/*where the movie information will be displayed*/}
          <div className="col-sm-10">
            <div className="movie-info media-body">
              <div className="moveAndDelete">
                <span className="pull-right">
                  <button className="movie-delete btn btn-sm btn-danger" title="Delete this movie from the list" onClick={this.removeFromList}>
                  <span className="glyphicon glyphicon-remove"></span></button>
                </span>
                <span className="pull-right">
                  <button className="movie-delete btn btn-sm btn-success" title="Move this movie to your ranked list" onClick={this.toggleMoveMovieDisplay}>
                  <span className="glyphicon glyphicon-share-alt"></span></button>
                </span>
                <span className="pull-right">
                  <button className="movie-delete view-trailer btn btn-sm btn-success" title="View this trailer on youtube" onClick={this.viewTrailer}>
                  <span className="glyphicon glyphicon-play-circle"></span></button>
                </span>
              </div>

              <div className="movie-head">
                <span className="movie-name">{this.props.singleItem.movieName}</span>
              </div>

              <div className="director-name">
                <span className="label-item">Directed By:</span>{this.props.singleItem.directorName}
              </div>

              <div className="cast">
                <span className="label-item">Actors:</span>{this.props.singleItem.actors.join(", ")}
              </div>

              <div className="director-name">
                <span className="label-item">Genre:</span>{this.props.singleItem.genres.join(", ")}
              </div>

              <div>
                <span className="label-item">Summary:</span>
                <span className="movie-notes">{this.props.singleItem.Summary}</span>
              </div>

              <div className="release-date" >
                <span className="label-item">Release Year:</span>{this.props.singleItem.releaseDate}
                <span className="pull-right">{this.props.singleItem.duration} minutes</span>
                <span className="label-item pull-right">Duration:</span>
              </div>
              {/*<div className="reviews">
                <span className="label-item">Rotten Tomatoes: </span>{this.props.singleItem.rottenTomatoes}
                <span className="pull-right"><i>Duration: {this.props.singleItem.duration}</i></span>
              </div>*/}
            </div>
          </div>

        </li>
      </div>
    )
  }
});

//everything will be exported from this file and sent to renderer.js
module.exports = WatchlistMovies;
