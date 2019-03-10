var React = require('react');
var AddMovie = require('./AddMovieForm.js')

var Toolbar = React.createClass({
  getInitialState: function(){
    return {
      isAddModalVisible: false, //controls the addMovie modal visibility
      isShowingRankedList: true
    }
  },

  //Switch to Ranked List
  displayTheRankedList: function(){
    // console.log("ranked list being displayed");
    this.setState({
      isShowingRankedList: true
    });
    this.props.displayRanked();
  },

  //Switch to Watchist
  displayTheWatchlist: function(){
    // console.log("ranked list being displayed");
    this.setState({
      isShowingRankedList: false
    });
    this.props.displayWatchlist();
  },

  //Open the addMovie modal if it is not already open, close it if it is
  toggleMovieDisplay: function(){
    var tempVisibility = !this.state.isAddModalVisible;
    this.setState({
      isAddModalVisible: tempVisibility
    }); //setState
  }, //toggleMovieDisplay

  //Once movie information has been passed to the renderer, close the modal
  addMovieAndCloseMyModalPlease: function(tempItem) {
    this.props.addMovie(tempItem);
    this.setState({
      isAddModalVisible: false
    });
  },

  //Pulls up the window with information about the app and its usage
  showAbout: function(){
    console.log("we've been clicked and should be displaying the about")
    this.props.handleAbout();
  },

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
          isVisible = {this.state.isAddModalVisible}
          isDisplayingRanked = {this.state.isShowingRankedList}
        />
      </div>
    ) //return
  } //render
}); //Toolbar

module.exports = Toolbar;
