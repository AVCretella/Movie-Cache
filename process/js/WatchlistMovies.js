//Creates the list of movies that are in data.json
//In the future, we will be pulling from a database, not a data.json file
var React = require('react');

var WatchlistMovies = React.createClass({
  getInitialState: function(){
    return{
      moveModalVisible: false,
      interestLevelChangeVisible: false
    }
  },

  viewTrailer: function(){ //send the name to the renderer and it'll open a window with the youtube link
    this.props.onViewTrailer(this.props.singleItem.movieName);
  },

  removeFromList: function(){
    this.props.onDelete(this.props.singleItem); //lets the function know which movie has been selected for deletion
  },

  //When the user wants to change the interest level
  //TODO may need to append 0 to all movies in order to see this field displayed
  handleChangeInterestLevel: function(interestLevel){
    console.log("button ", interestLevel, " pressed, lets set the interetlevel");
    console.log("items current interest level: ", this.props.singleItem.interestLevel);
    // submitEvent.preventDefault(); //this is to prevent the page from reloading, we will handle manually with React
    // let newInterestLevel = (parseFloat(this.inputMovieInterestLevel.value)) ? parseFloat(this.inputMovieInterestLevel.value) : 0; //TODO this may come back as 0
    let newInterestLevel = interestLevel;
    this.props.onChangeInterestLevel(this.props.singleItem.movieName, newInterestLevel);
    // this.toggleChangeInterestLevelDisplay();
    // this.changeInterestLevelFormRef.reset();
  },

  // //When we want to show the interest level form
  // toggleChangeInterestLevelDisplay: function() {
  //   var tempVisibility = !this.state.interestLevelChangeVisible;
  //   this.setState({
  //     interestLevelChangeVisible: tempVisibility
  //   }); //setState
  //   this.changeInterestLevelFormRef.reset();
  // },

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

    //These control the dynamic nature of the modals - very basic - not correcct
    let style, className;
    if (this.state.moveModalVisible) {
      moveClass = "modal fade in";
      moveStyle = {
        display: "block",
        paddingLeft: "0px"
      };
    } else if (this.state.interestLevelChangeVisible) {
      interestClass = "modal fade in";
      interestStyle = {
        display: "block",
        paddingLeft: "0px"
      };
    } else {
      moveClass= "modal fade";
      moveStyle = { display: "none" };

      interestClass= "modal fade";
      interestStyle = { display: "none" };
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
        {/* Modal for the moveToFavorites functionality */}
        <div className={moveClass} id="moveToFaves" tabIndex="-1" role="dialog" style = {moveStyle}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="submit" className="close" onClick={this.toggleMoveMovieDisplay} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">Move &quot;{this.props.singleItem.movieName}&quot; To Your Favorites List</h4>
              </div>

              <form className="modal-body add-movie form-horizontal" ref={(ref) => this.moveMovieFormRef = ref} onSubmit={this.moveToFavorites}>
                <div className="form-group">
                  <label className="col-sm-10 control-label" htmlFor="rating">Your Rating for &quot;{this.props.singleItem.movieName}&quot;</label>
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

        {/* Modal for the changeInterestLevel functionality */}
        {/* <div className={interestClass} id="changeInterestLevel" tabIndex="-1" role="dialog" style = {interestStyle}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="submit" className="close" onClick={this.toggleChangeInterestLevelDisplay} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">Changing Your Interest Level in {this.props.singleItem.movieName}</h4>
              </div>

              <form className="modal-body add-movie form-horizontal" ref={(ref) => this.changeInterestLevelFormRef = ref} onSubmit={this.handleChangeInterestLevel}>
                <div className="form-group">
                  <label className="col-sm-5 control-label" htmlFor="interestLevel">New Interest Level For This Movie:</label>
                  <div className="col-sm-7">
                    <input type="number" step="0.1" min="0" max="10" className="form-control" placeholder={this.props.singleItem.interestLevel}
                      id="interestLevel" ref={(ref) => this.inputMovieInterestLevel = ref}/>
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-sm-offset-3 col-sm-9">
                    <div className="pull-right">
                      <button type="submit" className="btn btn-success">Change Interest Level</button>
                    </div>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div> */}


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

              <div className="description">
                <span className="label-item">Summary:</span>
                <span className="movie-notes">{this.props.singleItem.Summary}</span>
              </div>

              <div className="release-date" >
                <span className="label-item">Release Year:</span>{this.props.singleItem.releaseDate}
              </div>

              <div className="interest-duration" >
                <button
                  className={`btn btn-xs ${this.props.singleItem.interestLevel === 0 ? 'btn-danger' : null}`}
                  onClick={() => this.handleChangeInterestLevel(0)}>
                    <span className="glyphicon glyphicon-remove-sign"></span>
                  </button>
                <button
                  className={`btn btn-xs ${this.props.singleItem.interestLevel === 1 ? 'btn-warning' : null}`}
                  onClick={() => this.handleChangeInterestLevel(1)}>
                    <span className="glyphicon glyphicon-minus-sign"></span>
                </button>
                <button
                  className={`btn btn-xs ${this.props.singleItem.interestLevel === 2 ? 'btn-success' : null}`}
                  onClick={() => this.handleChangeInterestLevel(2)}>
                    <span className="glyphicon glyphicon-ok-sign"></span>
                </button>
                {/* <span class="slidecontainer" style={{width: '40%'}}>
                  <input type="range" min="0" max="2" value={this.props.singleItem.interestLevel} class="slider" id="myRange"></input>
                </span> */}
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
