var React = require('react');

/* INCOMP Will probably just end up turning this into a SearchMovie.js where there is one field
    to search for a movie and get the JSON back, we'll see, but this was an interesting look
    at using bootstrap modals, could have used this over the summer for sure */
var AddMovie = React.createClass({
  toggleMovieDisplay: function(){
    this.props.handleToggle();
  },
  handleAdd: function(submitEvent){ //pass the fact that the submitEvent has happened from the form
    submitEvent.preventDefault(); //this is to prevent the page from reloading, we will handle manually with React
    var tempItem = { //temporary store the info that we want to add
      movieName: this.inputMovieName.value,
      directorName: this.inputMovieDirector.value,
      releaseDate: this.inputMovieReleaseDate.value,
      Summary: this.inputMovieSummary.value,
      duration: this.inputMovieDuration.value,
      viewCount: this.inputMovieViewCount.value
    } //temp items

    this.props.addMovie(tempItem); //pass the object to the function in the renderer process

  },
  render: function(){ //using bootstrap modal for the movie creation form. All proof of concept
    return(
      <div className="modal fade" id="addMovie" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.toggleMovieDisplay} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Add a Movie</h4>
            </div>

            <form className="modal-body add-movie form-horizontal" onSubmit={this.handleAdd}>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="movieName">Movie Name</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="movieName" ref={(ref) => this.inputMovieName = ref} placeholder="Movie's Name" />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="director">Director</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="director" ref={(ref) => this.inputMovieDirector = ref} placeholder="Director's Name" />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="releaseDate">Release Date</label>
                <div className="col-sm-9">
                  <input type="date" className="form-control"
                    id="releaseDate" ref={(ref) => this.inputMovieReleaseDate = ref} />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="duration">Duration</label>
                <div className="col-sm-9">
                  <input type="number" min="0" className="form-control"
                    id="duration" ref={(ref) => this.inputMovieDuration = ref}/>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="Summary">Summary</label>
                <div className="col-sm-9">
                  <textarea className="form-control" rows="4" cols="50"
                    id="Summary" ref={(ref) => this.inputMovieSummary = ref} placeholder="Movie Summary"></textarea>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="duration">How Many Times Have You Seen This Movie?</label>
                <div className="col-sm-9">
                  <input type="number" min="0" className="form-control" default="1"
                    id="viewCount" ref={(ref) => this.inputMovieViewCount = ref}/>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                  <div className="pull-right">
                    <button type="button" className="btn btn-default" onClick={this.toggleMovieDisplay}>Cancel</button>&nbsp;
                    <button type="submit" className="btn btn-primary">Add Movie</button>
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    )//return
  } //render
}); //AddMovie

module.exports = AddMovie;
