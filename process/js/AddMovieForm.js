var React = require('react');

/* TODO May want to turn this into just the movie title field, so the user can search for it, and if the correct information isn't returned
  go back to the first modal and tell them to include the year to have a better chance of finding the movie.

  Maybe allow them to switch to manual mode, but probs no need for that*/
var AddMovieForm = React.createClass({
  getInitialState: function(){
    return{
      defaultName: 'Type in a name and press Search!',
      defaultRank: 'Your rank for this movie out of 10.0',
      defaultDirector : 'Director\'s Name',
      defaultActors: 'Actors / Actresses',
      defaultGenre: 'Genre of the movie',
      defaultReleaseDate: 'The year the movie was released',
      defaultDuration: 'Ex: 120 min',
      defaultSummary: '',
      defaultViewCount: '1',
      defaultPoster: 'Put the url to the movie\'s poster here',
      defaultNameNotFound: 'Movie Not Found - Please try again',
    }
  },

  toggleMovieDisplay: function(submitEvent){
    console.log("should reset");
    this.resetForm();
    this.props.handleToggle();
  },

  //this takes whatever title you have put in and will use my API key to retrieve the JSON object
  /* If you want to use the API again or get more info: http://www.omdbapi.com/ */
  /* TODO need to accept a parameter of Title so that this can be modularized, so that all it does it get back the json object
    other functions will be responsible for the manipulation of that JSON object*/
  sendTitleToAPI: function(){
    var searchTitle = this.inputMovieName.value;
    var baseQuery = 'http://www.omdbapi.com/?t=';
    var APIkey = '&apikey=2d5be971';
    var longPlot = '&plot=full'; //TODO let this be dynamically short or long, maybe user inputs this?
    var year = '';
    if (this.inputMovieReleaseDate.value != undefined) { //including the year will make the query more accurate
      year = '&y=' + this.inputMovieReleaseDate.value;
    }
    console.log(searchTitle);
    if(searchTitle != ""){
      var fullQuery = baseQuery + searchTitle + year + APIkey;
      console.log("fullquery: ", fullQuery);
      fetch(baseQuery + searchTitle + year + APIkey) //send the query to OMDB for searching
      .then(response => response.json())
      .then(json =>{
        console.log(JSON.stringify(json));

        //Finally set all of the retrieved data to the respective spot in the AddMovie Form
        if(json.Response != "False"){ //if we don't get an error from the API
          this.inputMovieName.value = json.Title;
          this.inputMoviePoster.value = json.Poster;
          this.inputMovieDirector.value = json.Director;
          this.inputMovieActors.value = json.Actors;
          this.inputMovieGenre.value = json.Genre;
          this.inputMovieReleaseDate.value = json.Year;
          this.inputMovieSummary.value = json.Plot;
          this.inputMovieDuration.value = json.Runtime;

          //TODO Run through the ratings array and find "Rotten Tomatoes"
          // for (i in json.Ratings){
          //   if(json.Ratings[i].Source == "Rotten Tomatoes"){
          //     // this.inputMovieRottenTomatoes.value = json.Ratings[i].Value; TODO need to save this in movie object
          //     break;
          //   }
          //   console.log("ratings ", json.Ratings[i]);
          // }
        } else {
          this.inputMovieName.value = this.state.defaultNameNotFound;
        }
      });
    }
  },

  handleAdd: function(submitEvent){ //pass the fact that the submitEvent has happened from the form
    submitEvent.preventDefault(); //this is to prevent the page from reloading, we will handle manually with React

    //When the Favorites list is being displayed, we need to send the viewCount and rank as well
    var tempItem = {};
    /*
      When storing numbers, if they are stored as strings, sorting does not
      work as intended. Need to store as actual ints
    */
    let durationMinutes = parseInt(this.inputMovieDuration.value.match(/[0-9]+/g)[0]);
    let releaseDateInt = parseInt(this.inputMovieReleaseDate.value.match(/[0-9]+/g)[0]);
    let formattedGenres = this.inputMovieGenre.value.split(', ');
    let formattedActors = this.inputMovieActors.value.split(', ');

    //TODO for movies without some information, we need to have safe cases for all of them
            //something like 'triple frontier' has no duration yet, breaks the modal

    if (this.props.isDisplayingRanked) {
      var timesSeen = parseInt(this.inputMovieViewCount.value.match(/[0-9]+/g)[0]); //only in the ranked list

      tempItem = { //create an item with the values we want to add
        movieName: this.inputMovieName.value,
        posterURL: this.inputMoviePoster.value,
        directorName: this.inputMovieDirector.value,
        actors: formattedActors,
        genres: formattedGenres,
        releaseDate: releaseDateInt,
        Summary: this.inputMovieSummary.value,
        duration: durationMinutes,
        viewCount: timesSeen,
        rank: this.inputMovieRank.value
        // rottenTomatoes: this.inputMovieRottenTomatoes.value,
      }
    } else { //if just a wishlist movie, need less information
      tempItem = {
        movieName: this.inputMovieName.value,
        posterURL: this.inputMoviePoster.value,
        directorName: this.inputMovieDirector.value,
        actors: formattedActors,
        genres:  formattedGenres,
        releaseDate: releaseDateInt,
        Summary: this.inputMovieSummary.value,
        duration: durationMinutes
      }
    }

    this.props.addMovie(tempItem); //pass the object to the function in the renderer process
    this.resetForm();
    // this.inputMovieRottenTomatoes.value = 'Rotten Tomatoes Rating',
  },

  resetForm: function(){
    this.addMovieForm.reset();
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

    if (this.props.isDisplayingRanked) { //if we are displaying the ranked, include these in the form
      //TODO figure out why we cant use 10 when comparing double vals!!
      rank =  <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="rank">Your Rating:</label>
                <div className="col-sm-9">
                  <input type="number" step=".01" min="0" max="9.99" className="form-control" placeholder={this.state.defaultRank}
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
    } else { //otherwise leave them empty
      rank = <div></div>;
      times_seen = <div></div>;
    }

    /*
    TODO want a first modal that asks for the movie name, so the user has to
      search and there is no ambiguity involved, then bring them to full modal
    Can ask if they would like a short or long Plot
    Can also see if they want to add the year
    */
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
                {/* TODO if we sendTitleToAPI with an argument, we czn modularize, send with this.inputMovieName*/}
                {/* TODO need to execute two functions on this single click *
                    If you want it to be real jank, you can send the title and that it's from the form and have a conditional in the function */}
                <div className="col-sm-3">
                  <button type="button" className="btn btn-success" onClick={this.sendTitleToAPI}>Search</button>
                </div>
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
                <label className="col-sm-3 control-label" htmlFor="genre">Genre</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="genre" ref={(ref) => this.inputMovieGenre = ref} placeholder={this.state.defaultGenre} />
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
                  <button className="btn btn-reset" title="Click on me if things are feeling wonky and start over" onClick={this.resetForm} aria-label="Reset">Reset</button>&nbsp;
                  <div className="pull-right">
                    <button type="submit" className="btn btn-danger" title="don't let your dreams be dreams" onClick={this.toggleMovieDisplay} aria-label="Cancel">Cancel</button>&nbsp;
                    <button type="submit" className="btn btn-primary" title="Add this boi to the list">Add Movie</button>
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
