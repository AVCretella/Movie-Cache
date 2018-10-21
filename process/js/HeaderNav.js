var React = require('react');
var HeaderNav = React.createClass({
  handleSearch: function(event){ //will send an event notification with the query to to renderer process
    this.props.onSearch(event.target.value);
  }, //handleSearch
  handleSort: function(event){
    this.props.onReOrder(event.target.id, this.props.orderDir);
  }, //handleSort
  handleOrder: function(event){
    this.props.onReOrder(this.props.orderBy, event.target.id);
  }, //handleOrder

  //this is basically just a bootstap header, with className for react like usual
  //each of the serach options is clickable and will dynamically change the list
  render: function(){
    return(
      <nav className="navigation navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header"><a className="navbar-brand" href="#">Movie Cache</a></div>
          <div className="navbar-form navbar-right search-movies">
              <div className="input-group">
                <input id="SearchMovies" onChange={this.handleSearch} placeholder="Search" autoFocus type="text" className="form-control" aria-label="Search Movies" />
                <div className="input-group-btn">
                  <button type="button" className="btn btn-info dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Sort by
                    <span className="caret"></span>
                  </button>
                    <ul className="dropdown-menu dropdown-menu-right">
                      <li><a href="#" id="movieName" onClick={this.handleSort}>Movie Name {(this.props.orderBy === 'movieName') ? <span className="glyphicon glyphicon-ok"></span>:null}</a></li>
                      <li><a href="#" id="releaseDate" onClick={this.handleSort}>Release Date {(this.props.orderBy === 'releaseDate') ? <span className="glyphicon glyphicon-ok"></span>:null}</a></li>
                      <li><a href="#" id="directorName" onClick={this.handleSort}>Director {(this.props.orderBy === 'directorName') ? <span className="glyphicon glyphicon-ok"></span>:null}</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a href="#" id="asc" onClick={this.handleOrder}>Asc {(this.props.orderDir === 'asc') ? <span className="glyphicon glyphicon-ok"></span>:null}</a></li>
                      <li><a href="#" id="desc" onClick={this.handleOrder}>Desc  {(this.props.orderDir === 'desc') ? <span className="glyphicon glyphicon-ok"></span>:null}</a></li>
                    </ul>
                </div>{/* input-group-btn */}
            </div>{/* input-group */}
          </div>{/* navbar-form */}
        </div>{/* container-fluid */}
      </nav>
    )
  }
});

module.exports = HeaderNav;
