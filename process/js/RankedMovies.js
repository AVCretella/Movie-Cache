//Creates the list of movies that are in data.json
//In the future, we will be pulling from a database, not a data.json file
var React = require('react');

var RankedMovies = React.createClass({

  removeFromList: function(){
    this.props.onDelete(this.props.singleItem); //lets the function know which movie has been selected for deletion
  },

  //1 column for the poster image, 11 cols for the name, description .. stuff
  render: function(){
    return(
      <li className="movie-item media">
        <div className="media-left">
          <button className="movie-delete btn btn-xs btn-danger" onClick={this.removeFromList}>
          <span className="glyphicon glyphicon-remove"></span></button>
        </div>

        <div className="col-sm-2">
          <div className="movie-poster">
            <img src={this.props.singleItem.posterURL} style={{width: '100%', height: '100%'}} alt="{this.props.singleItem.movieName}'s Poster Image"></img>
          </div>
        </div>

        <div className="col-sm-10">
          <div className="movie-info media-body">
            <div className="movie-head">
              <span className="movie-name">{this.props.singleItem.movieName}</span>
              <button className="btn btn-primary pull-right">#<span className="rank">{this.props.singleItem.rank}</span></button>
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
            <div className="release-date">
              <span className="label-item">Release Year:</span>{this.props.singleItem.releaseDate}
              <span className="pull-right"><i>Duration: {this.props.singleItem.duration}</i></span>
            </div>
          </div>
        </div>
      </li>
    )
  }
});

//everything will be exported from this file and sent to renderer.js
module.exports = RankedMovies;
//
// export default RankedMovies;
// export foo;
// export bar;
