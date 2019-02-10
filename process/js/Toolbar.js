var React = require('react');
var AddMovie = require('./AddMovieForm.js')

var Toolbar = React.createClass({
  getInitialState: function(){
    return {
      isModalVisible: false,
      isShowingRankedList: true
    }
  },

  displayTheRankedList: function(){
    console.log("ranked list being displayed");
    this.setState({
      isShowingRankedList: true
    });
    this.props.displayRanked();
  },

  displayTheWatchlist: function(){
    console.log("ranked list being displayed");
    this.setState({
      isShowingRankedList: false
    });
    this.props.displayWatchlist();
  },

  toggleMovieDisplay: function(){ //this will allow us to add a movie to a list
    var tempVisibility = !this.state.isModalVisible;
    this.setState({
      isModalVisible: tempVisibility
    }); //setState
  }, //toggleMovieDisplay

  addMovieAndCloseMyModalPlease: function(tempItem) {
    this.props.addMovie(tempItem);
    this.setState({
      isModalVisible: false
    });
  },

  showAbout: function(){ //we want to display the show about on the toolbar
    console.log("we've been clicked and should be displaying the about")
    this.props.handleAbout();
  },

  //INCOMP - add list buttons to this render function and figure out how to change the main page
  render: function() { //when the about icon is clicked, it will send an event notification through above func
    return(
      <div>
        <div className="toolbar">

          <div className="toolbar-item" onClick={this.toggleMovieDisplay}>
            <span className="toolbar-item-button glyphicon glyphicon-plus-sign"></span>
            <span className="toolbar-item-text">Add Movie</span>
          </div>

          <div className="toolbar-item" onClick={this.displayTheRankedList}>
            <span className="toolbar-item-button glyphicon glyphicon-star"></span>
            <span className="toolbar-item-text">Favorites</span>
          </div>

          <div className="toolbar-item" onClick={this.displayTheWatchlist}>
            <span className="toolbar-item-button glyphicon glyphicon-time"></span>
            <span className="toolbar-item-text">Watch list</span>
          </div>

          <div className="toolbar-item" onClick={this.showAbout}>
            <span className="toolbar-item-button glyphicon glyphicon-question-sign"></span>
            <span className="toolbar-item-text">Help</span>
          </div>
        </div>
        <AddMovie //this is for the modal that will appear
          handleToggle = {this.toggleMovieDisplay} //send an event to toggle the modal
          addMovie = {this.addMovieAndCloseMyModalPlease} //when submitted, send event notification
          isVisible = {this.state.isModalVisible}
          isDisplayingRanked = {this.state.isShowingRankedList}
        />
      </div>
    ) //return
  } //render
}); //Toolbar

module.exports = Toolbar;
