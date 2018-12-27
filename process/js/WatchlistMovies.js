//Creates the list of movies that are in data.json
//In the future, we will be pulling from a database, not a data.json file
var React = require('react');

var WatchlistMovies = React.createClass({

  removeFromList: function(){
    this.props.onDelete(this.props.singleItem); //lets the function know which movie has been selected for deletion
  },

  moveToFavorites: function(){
    console.log("trying to move movie", this.props.singleItem);
    this.props.onDelete(this.props.singleItem); //lets the function know which movie has been selected for deletion
  },

  render: function(){
    return(
      <li className="movie-item media">

      {/* need to handle bad poster urls */}
        <div className="col-sm-2">{/*where the poster will be displayed*/}
          <div className="movie-poster">
            <img src={this.props.singleItem.posterURL} style={{width: '100%', height: '100%'}} alt="[ Movie Poster Unavailable ]"></img>
          </div>
        </div>

        <div className="col-sm-10">{/*where the movie information will be displayed*/}
          <div className="movie-info media-body">
            <div className="movie-head">
              <span className="movie-name">{this.props.singleItem.movieName}</span>
              {/* TODO want another span for a movie to favorites button */}
              {/*<span className="pull-right">
                <button className="movie-delete btn btn-med btn-success" onClick={this.moveToFavorites}>
                <span className="glyphicon glyphicon-add">Move To Favorites</span></button>
              </span> */}
              <span className="pull-right">
                <button className="movie-delete btn btn-xs btn-danger" onClick={this.removeFromList}>
                <span className="glyphicon glyphicon-remove"></span></button>
              </span>
            </div>
            <div className="director-name">
              <span className="label-item">Directed By:</span>{this.props.singleItem.directorName}
            </div>
            <div className="director-name">
              <span className="label-item">Actors:</span>{this.props.singleItem.actors}
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
            {/*<div className="release-date">
              <span className="label-item">Rotten Tomatoes: </span>{this.props.singleItem.rottenTomatoes}
              <span className="pull-right"><i>Duration: {this.props.singleItem.duration}</i></span>
            </div>*/}
          </div>
        </div>

      </li>
    )
  }
});

//everything will be exported from this file and sent to renderer.js
module.exports = WatchlistMovies;
