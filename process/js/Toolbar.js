var React = require('react');
var AddMovie = require('./AddMovie.js')

var Toolbar = React.createClass({
  getInitialState: function(){
    return {
      isModalVisible: false
    }
  },

  toggleMovieDisplay: function(){ //this will allow us to add a movie to a list
    var tempVisibility = !this.state.isModalVisible;
    this.setState({
      isModalVisible: tempVisibility
    }); //setState
  }, //toggleMovieDisplay

  // showAbout: function(){ //we want to display the show about on the toolbar
  //   ipc.sendSync('openInfoWindow'); //sends event notification to main process
  // },

  //INCOMP - add list buttons to this render function and figure out how to change the main page
  render: function() { //when the about icon is clicked, it will send an event notification through above func
    return(
      <div>
        <div className="toolbar">
          <div className="toolbar-item" onClick={this.toggleMovieDisplay}>
            <span className="toolbar-item-button glyphicon glyphicon-plus-sign"></span>
            <span className="toolbar-item-text">Add Movie</span>
          </div>
          <div className="toolbar-item" onClick={this.props.displayRanked}>
            <span className="toolbar-item-button"></span>
            <span className="toolbar-item-text">Ranked List</span>
          </div>
          <div className="toolbar-item" onClick={this.props.displayWatchlist}>
            <span className="toolbar-item-button"></span>
            <span className="toolbar-item-text">Watch list</span>
          </div>
        </div>
        <AddMovie //this is for the modal that will appear
          handleToggle = {this.toggleMovieDisplay} //send an event to toggle the modal
          addMovie = {this.props.addMovieObject} //when submitted, send event notification
          isVisible = {this.state.isModalVisible}
        />
      </div>
    ) //return
  } //render
}); //Toolbar

module.exports = Toolbar;


// <div className="toolbar-item" onClick={this.toggleAbout}>
//   <span className="toolbar-item-button glyphicon glyphicon-question-sign"></span>
//   <span className="toolbar-item-text">About this app</span>
// </div>
