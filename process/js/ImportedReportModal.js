var React = require('react');

var ImportedReportModal = React.createClass({
  getInitialState: function(){
    return{
      badNameErrorMessage: 'These titles are incorrect in some way',
      duplicateErrorMessage: 'These movies already existed in your list!'
    }
  },

  render: function(){ //using bootstrap modal for the movie creation form. All proof of concept
    return(
      <div className={className} id="addMovie" tabIndex="-1" role="dialog" style = {style}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="submit" className="close" onClick={this.toggleMovieDisplay} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Movies Not Added</h4>
            </div>
          </div>
        </div>
      </div>
    )//return
  } //render
});

module.exports = ImportedReportModal;
