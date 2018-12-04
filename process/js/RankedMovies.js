//Creates the list of movies that are in data.json
//In the future, we will be pulling from a database, not a data.json file
var React = require('react');

var RankedMovies = React.createClass({

  removeFromList: function(){
    this.props.onDelete(this.props.singleItem); //lets the function know which movie has been selected for deletion
  },
  // changeRank: function(){
  //   this.props.onChangeRank(this.props.whichItem); //need to know which movie to change the rank of
  // },

  render: function(){
    return(
      <li className="movie-item media">
        <div className="media-left">
          <button className="movie-delete btn btn-xs btn-danger" onClick={this.removeFromList}>
          <span className="glyphicon glyphicon-remove"></span></button>
        </div>
        <div className="movie-info media-body">
          <div className="movie-head">
            <span className="movie-name">{this.props.singleItem.movieName}</span>
            <button className="btn btn-primary pull-right">#<span className="rank">{this.props.singleItem.rank}</span></button>
          </div>
          <div className="director-name">
            <span className="label-item">Directed By:</span>{this.props.singleItem.directorName}
          </div>
          <div>
            <span className="label-item">Summary:</span>
            <span className="movie-notes">{this.props.singleItem.Summary}</span>
          </div>
          <div className="release-date">
            <span className="label-item">Release Date:</span>{this.props.singleItem.releaseDate}
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
