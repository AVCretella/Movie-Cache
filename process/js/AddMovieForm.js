var React = require('react');

var defaultDate = new Date();
defaultDate.setDate(defaultDate.getDate());
function formatDate(date, divider) { //divider is what will separate the days
  var someday = new Date(date);
  var month = someday.getUTCMonth() + 1;
  var day = someday.getUTCDate();
  var year = someday.getUTCFullYear();

  //if num <= 9, prepend a 0 for correct formatting
  if(month <= 9){
    month = '0' + month;
  }
  if(day <= 9){
    day = '0' + day;
  }
  return ('' + year + divider + month + divider + day);
}


/* TODO Will probably just end up turning this into a SearchMovie.js where there is one field
    to search for a movie and get the JSON back, we'll see, but this was an interesting look
    at using bootstrap modals, could have used this over the summer for sure */
var AddMovieForm = React.createClass({
  getInitialState: function(){
    return{
      defaultName: 'Type in a name and press Search!',
      defaultRank: 'Your rank for this movie out of 10.0',
      defaultDirector : 'Director\'s Name',
      defaultActors: 'Actors / Actresses',
      defaultReleaseDate: 'The year the movie was in theaters',
      defaultDuration: 'Ex: 120 min',
      defaultSummary: '',
      defaultViewCount: '1',
      defaultPoster: 'Put the url to the movie\'s poster here',
      defaultNameNotFound: 'Movie Not Found - Please try again'
    }
  },
  //When toggling the display, want to reset the information in it
  //TODO when clicking 'x' and 'cancel' as well
  toggleMovieDisplay: function(submitEvent){
    console.log("should reset");
    this.addMovieForm.reset();
    this.props.handleToggle();
  },

  //this takes whatever title you have put in and will use my API key to retrieve the JSON object
  /* If you want to use the API again or get more info: http://www.omdbapi.com/ */
  sendTitleToAPI: function(){
    var searchTitle = this.inputMovieName.value;
    var baseQuery = 'http://www.omdbapi.com/?t=';
    var APIkey = '&apikey=2d5be971';
    console.log(searchTitle);
    if(searchTitle != ""){
      fetch(baseQuery + searchTitle + APIkey) //send the query to OMDB for searching
      .then(response => response.json())
      .then(json =>{
        console.log(JSON.stringify(json));

        //Finally set all of the retrieved data to the respective spot in the AddMovie Form
        if(json.Response != "False"){ //if we don't get an error from the API
          this.inputMovieName.value = json.Title;
          this.inputMoviePoster.value = json.Poster;
          this.inputMovieDirector.value = json.Director;
          this.inputMovieActors.value = json.Actors;
          this.inputMovieReleaseDate.value = json.Year; //TODO need to change the format of released date, probably just turn into the year
          this.inputMovieSummary.value = json.Plot;
          this.inputMovieDuration.value = json.Runtime; //TODO may want to save just the numbers

          //Run through the ratings array and find "Rotten Tomatoes"
          for (i in json.Ratings){
            if(json.Ratings[i].Source == "Rotten Tomatoes"){
              // this.inputMovieRottenTomatoes.value = json.Ratings[i].Value; TODO need to save this in movie object
              break;
            }
            console.log("ratings ", json.Ratings[i]);
          }
        } else {
          this.inputMovieName.value = this.state.defaultNameNotFound;
        }
      });
    }
  },

  handleAdd: function(submitEvent){ //pass the fact that the submitEvent has happened from the form
    submitEvent.preventDefault(); //this is to prevent the page from reloading, we will handle manually with React

    var tempItem = { //create an item with the value we want to add
      movieName: this.inputMovieName.value,
      posterURL: this.inputMoviePoster.value,
      directorName: this.inputMovieDirector.value,
      actors: this.inputMovieActors.value,
      releaseDate: this.inputMovieReleaseDate.value,
      Summary: this.inputMovieSummary.value,
      duration: this.inputMovieDuration.value,
      viewCount: this.inputMovieViewCount.value,
      rank: this.inputMovieRank.value
      // rottenTomatoes: this.inputMovieRottenTomatoes.value,
    }

    this.props.addMovie(tempItem); //pass the object to the function in the renderer process
    this.addMovieForm.reset();
    // this.inputMovieRottenTomatoes.value = 'Rotten Tomatoes Rating',
  },
  render: function(){ //using bootstrap modal for the movie creation form. All proof of concept
    let style, className;
    if (this.props.isVisible) {
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

    if (true) {
      rank =  <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="rank">Your Rating:</label>
                <div className="col-sm-9">
                  <input type="number" step=".1" min="0" max="10" className="form-control" placeholder={this.state.defaultRank}
                    id="rank" ref={(ref) => this.inputMovieRank = ref} required/>
                </div>
              </div>;
      times_seen =  <div className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="duration">Times Seen:</label>
                      <div className="col-sm-9">
                        <input type="number" min="0" className="form-control" placeholder={this.state.defaultViewCount}
                          id="viewCount" ref={(ref) => this.inputMovieViewCount = ref} required/>
                      </div>
                    </div>;
    } else {
      rank = <div></div>;
      times_seen = <div></div>;
    }

    return(
      <div className={className} id="addMovie" tabIndex="-1" role="dialog" style = {style}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="submit" className="close" onClick={this.toggleMovieDisplay} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Add a Movie</h4>
            </div>

            <form className="modal-body add-movie form-horizontal" ref={(ref) => this.addMovieForm = ref} onSubmit={this.handleAdd}>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="movieName">Movie Name</label>
                <div className="col-sm-6">
                  <input type="text" className="form-control"
                    id="movieName" ref={(ref) => this.inputMovieName = ref} placeholder={this.state.defaultName} />
                </div>
                <div className="col-sm-3">
                  <button type="button" className="btn btn-success" onClick={this.sendTitleToAPI}>Search</button>
                </div>
                {/*<div> //want a popup when you enter an invalid name
                  <span> Movie with this title not found </span>
                </div>*/}
              </div>

              {/* TODO eventually want to make this rank changeable without having to re-add movie */}
              {/* TODO want to make this only appear when the ranked list is used */}
              {rank}

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="director">Director</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="director" ref={(ref) => this.inputMovieDirector = ref} placeholder={this.state.defaultDirector} />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="director">Cast:</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="actors" ref={(ref) => this.inputMovieActors = ref} placeholder={this.state.defaultActors} />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="releaseDate">Release Year</label>
                <div className="col-sm-9">
                  <input type="number" className="form-control"
                    id="releaseDate" ref={(ref) => this.inputMovieReleaseDate = ref} placeholder={this.state.defaultReleaseDate}/>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="duration">Duration</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="duration" ref={(ref) => this.inputMovieDuration = ref} placeholder={this.state.defaultDuration}/>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="Summary">Summary</label>
                <div className="col-sm-9">
                  <textarea className="form-control" rows="4" cols="50"
                    id="Summary" ref={(ref) => this.inputMovieSummary = ref} placeholder={this.state.defaultSummary}></textarea>
                </div>
              </div>

              {/* TODO only show this if on the Ranked List */}
              {times_seen}

                  {/* TODO want to add rotten tomatoes reviews here and have duration to the right */}
                  {/* TODO should I keep everything as amanual textbox in case they want to put in their own info? */}
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="poster">Poster URL:</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="posterURL" ref={(ref) => this.inputMoviePoster = ref} placeholder={this.state.defaultPoster} />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-offset-3 col-sm-9">
                  <div className="pull-right">
                    <button type="submit" className="btn btn-default" onClick={this.toggleMovieDisplay}>Cancel</button>&nbsp;
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

module.exports = AddMovieForm;
