//Creates the list of movies that are in data.json
//In the future, we will be pulling from a database, not a data.json file
var React = require('react');

var RankedMovies = React.createClass({
  getInitialState: function(){
    return{
      rankChangeVisible: false
    }
  },

  removeFromList: function(){
    this.props.onDelete(this.props.singleItem); //lets the function know which movie has been selected for deletion
  },

  handleChangeRank: function(submitEvent){
    submitEvent.preventDefault(); //this is to prevent the page from reloading, we will handle manually with React

    let oldRank = this.props.singleItem.rank;

    // var tempItem = { //create an item with the value we want to add
    //   movieName: this.props.singleItem.movieName,
    //   rank: parseFloat(this.inputMovieRank.value)
    // }
    // this.props.onChangeRank(tempItem, oldRank); //passed up to MovieList.js

    let newRank = parseInt(this.inputMovieRank.value);
    this.props.onChangeRank(newRank, oldRank);
    this.toggleChangeRankDisplay();
    this.changeRankFormRef.reset();
  },

  //Want to close and reset the changeRank modal
  toggleChangeRankDisplay: function() {
    var tempVisibility = !this.state.rankChangeVisible;
    this.setState({
      rankChangeVisible: tempVisibility
    }); //setState
    this.changeRankFormRef.reset();
  },

  rankUp: function() {
    let oldRank = this.props.singleItem.rank;
    let newRank = this.props.singleItem.rank - 1;
    this.props.onMoveRankByOne(oldRank, newRank);
  },

  rankDown: function() {
    let oldRank = this.props.singleItem.rank;
    let newRank = this.props.singleItem.rank + 1;
    this.props.onMoveRankByOne(oldRank, newRank);
  },

  //1 column for the poster image, 11 cols for the name, description .. stuff
  render: function(){
    let style, className;
    if (this.state.rankChangeVisible) {
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

    if (this.props.sortField == 'rank') {
      moveButtons = <div className="col-sm-1">
                      <button className="btn btn-success" title="Move up one on the list" onClick={this.rankUp}>
                        <span className="glyphicon glyphicon-arrow-up"></span>
                      </button>
                      <button className="btn btn-danger" title="Move down one on the list" onClick={this.rankDown}>
                        <span className="glyphicon glyphicon-arrow-down"></span>
                      </button>
                    </div>;
      posterStyle = "col-sm-2";
      movieInfoStyle = "col-sm-9";
    } else {
      moveButtons = <div></div>;
      posterStyle = "col-sm-2";
      movieInfoStyle = "col-sm-10";
    }

    return(
      <div>
        {/* Modal for the changerank functionality */}
        <div className={className} id="changeRank" tabIndex="-1" role="dialog" style = {style}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="submit" className="close" onClick={this.toggleChangeRankDisplay} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title">Changing The Rank of {this.props.singleItem.movieName}</h4>
              </div>

              <form className="modal-body add-movie form-horizontal" ref={(ref) => this.changeRankFormRef = ref} onSubmit={this.handleChangeRank}>
                <div className="form-group">
                  <label className="col-sm-5 control-label" htmlFor="rank">New Rank For This Movie:</label>
                  <div className="col-sm-7">
                    <input type="number" step="1" min="1" className="form-control" placeholder={this.props.singleItem.rank}
                      id="rank" ref={(ref) => this.inputMovieRank = ref}/>
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-sm-offset-3 col-sm-9">
                    <div className="pull-right">
                      {/*<button type="submit" className="btn btn-default" onClick={this.toggleRankDisplay}>Cancel</button>&nbsp;*/}
                      <button type="submit" className="btn btn-success">Change Rank</button>
                    </div>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>

        <li className="item-list movie-item media">
          {moveButtons}
          <div className={posterStyle}>
            <div className="movie-poster">
              <img src={this.props.singleItem.posterURL} style={{width: '100%', height: '100%'}} alt="[ Movie Poster Unavailable ]"></img>
            </div>
          </div>

          <div className={movieInfoStyle}>
            <div className="movie-info media-body">
              <div className="movie-head">
                <span className="movie-name">{this.props.singleItem.movieName}</span>
                <span className="pull-right">
                  <button className="movie-delete btn btn-sm btn-danger" title="Delete this movie from the list" onClick={this.removeFromList}>
                  <span className="glyphicon glyphicon-remove"></span></button>
                </span>
                <button className="btn btn-primary btn-sm pull-right" onClick={this.toggleChangeRankDisplay}>
                  <span className="rank">{this.props.singleItem.rank}</span>
                </button>
              </div>

              <div className="director-name">
                <span className="label-item">Directed By:</span>{this.props.singleItem.directorName}
              </div>

              <div className="cast">
                <span className="label-item">Actors:</span>{this.props.singleItem.actors.join(", ")}
              </div>

              <div className="genres">
                <span className="label-item">Genre:</span>{this.props.singleItem.genres.join(", ")}
              </div>

              <div>
                <span className="label-item">Summary:</span>
                <span className="movie-notes">{this.props.singleItem.Summary}</span>
              </div>

              <div className="release-date">
                <span className="label-item">Release Year:</span>{this.props.singleItem.releaseDate}

                {/*
                <button className="btn btn-success btn-xs pull-right" onClick={this.toggleChangeRankDisplay}>
                  <span className="glyphicon glyphicon-plus"></span>
                </button>
                */}
                <span className="pull-right">{this.props.singleItem.viewCount}</span>
                <span className="label-item pull-right">Times Seen:</span>
              </div>

              <div className="personal-rating">
                <span className="label-item">Duration:</span>
                <span>{this.props.singleItem.duration} minutes</span>

                {/*
                <button className="btn btn-success btn-xs pull-right" onClick={this.toggleChangeRankDisplay}>
                  <span className="glyphicon glyphicon-plus"></span>
                </button>
                */}
                <span className="pull-right">{this.props.singleItem.personalRating}</span>
                <span className="label-item pull-right">Your Rating:</span>
              </div>

            </div>
          </div>
        </li>
      </div>
    )
  }
});

//everything will be exported from this file and sent to renderer.js
module.exports = RankedMovies;
