var React = require('react');

var Toolbar = React.createClass({
  toggleAbout: function(){
    this.props.handleAbout();
  },
  render: function() { //when the about icon is clicked, it will send an event notification through above func
    return(
      <div className="toolbar">
        <div className="toolbar-item" onClick={this.toggleAbout}>
          <span className="toolbar-item-button glyphicon glyphicon-question-sign"></span>
          <span className="toolbar-item-text">About this app</span>
        </div>
      </div>
    ) //return
  } //render
}); //Toolbar

module.exports = Toolbar;
