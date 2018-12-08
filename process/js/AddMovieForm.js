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

  toggleMovieDisplay: function(){
    this.props.handleToggle();
  },

  //this takes whatever title you have put in and will use my API key to retrieve the JSON object
  /*
  * If you want to use the API again or get more info: http://www.omdbapi.com/
  *
  */
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
        } else {
          this.inputMovieName.value = "Movie Not Found - Please try again"
        }
      });
        //TODO try to map the response information that you want and then return that
        // const filteredInfo = response.data.map(c => {
        //   return {
        //     title: c.Title,
        //     releaseDate: c.Year,
        //     duration: c.Runtime
        //   };
        // });
        // return filteredInfo.json();
        // const newState = Object.assign({}, this.state, {
        //   movieInfo: filterInfo
        // });
        // return response.json();
      // })
      // .then(
      //   this.inputMovieName.value = response.Title;
      // );
      // .then(function(myJson) {
      //   // console.log(JSON.stringify(myJson.Title));
      //   inputMovieDirector.value = JSON.stringify(myJson.Director);
      // });
    }
  },

  handleAdd: function(submitEvent){ //pass the fact that the submitEvent has happened from the form
    submitEvent.preventDefault(); //this is to prevent the page from reloading, we will handle manually with React
    var tempItem = { //temporary store the info that we want to add
      movieName: this.inputMovieName.value,
      posterURL: this.inputMoviePoster.value,
      directorName: this.inputMovieDirector.value,
      releaseDate: this.inputMovieReleaseDate.value,
      Summary: this.inputMovieSummary.value,
      actors: this.inputMovieActors.value,
      duration: this.inputMovieDuration.value,
      viewCount: this.inputMovieViewCount.value,
      rank: this.inputMovieRank.value
    } //temp items

    this.props.addMovie(tempItem); //pass the object to the function in the renderer process

    //all of this will reset the form after it has been submitted to the renderer process so it can be reused
    this.inputMovieName.value = '';
    this.inputMoviePoster.value = '';
    this.inputMovieDirector.value = '';
    this.inputMovieActors.value = '';
    //TODO {formatDate(defaultDate, '-')} put this back when you want to use full date instead of year. API gives different format and I don't want to deal with it right now
    this.inputMovieReleaseDate.value = '2000';
    this.inputMovieSummary.value = '';
    this.inputMovieDuration.value = '180';
    this.inputMovieViewCount.value = '1';
    this.inputMovieViewRank.value = '1';

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

    return(
      <div className={className} id="addMovie" tabIndex="-1" role="dialog" style = {style}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.toggleMovieDisplay} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Add a Movie</h4>
            </div>

            <form className="modal-body add-movie form-horizontal" onSubmit={this.handleAdd}>
              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="movieName">Movie Name</label>
                <div className="col-sm-6">
                  <input type="text" className="form-control"
                    id="movieName" ref={(ref) => this.inputMovieName = ref} placeholder="Movie's Name" />
                </div>
                <div className="col-sm-3">
                  <button type="button" className="btn btn-success" onClick={this.sendTitleToAPI}>Search</button>
                </div>
                {/*<div> //want a popup when you enter an invalid name
                  <span> Movie with this title not found </span>
                </div>*/}
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="director">Director</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="director" ref={(ref) => this.inputMovieDirector = ref} placeholder="Director's Name" />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="director">Director</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="actors" ref={(ref) => this.inputMovieActors = ref} placeholder="Actors / Actresses" />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="releaseDate">Release Year</label>
                <div className="col-sm-9">
                  <input type="number" className="form-control"
                    id="releaseDate" ref={(ref) => this.inputMovieReleaseDate = ref} defaultValue={'2000'}/>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="duration">Duration</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="duration" ref={(ref) => this.inputMovieDuration = ref} defaultValue = {'120'}/>
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
                  <input type="number" min="0" className="form-control" defaultValue={'1'}
                    id="viewCount" ref={(ref) => this.inputMovieViewCount = ref}/>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="rank">Rank:</label>
                <div className="col-sm-9">
                  <input type="number" min="0" className="form-control" defaultValue={'1'}
                    id="rank" ref={(ref) => this.inputMovieRank = ref}/>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" htmlFor="poster">Poster URL:</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control"
                    id="posterURL" ref={(ref) => this.inputMoviePoster = ref} placeholder="Movie Poster URL" />
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

module.exports = AddMovieForm;
