var React = require('react');
var HeaderNav = React.createClass({
  handleSearch: function(event){ //will send an event notification with the query to to renderer process
    this.props.onSearch(event.target.value);
  },
  render: function(){ //this is basically just a bootstap header, with className for react like usual
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
                      <li><a href="#" id="movieName">Movie Name</a></li>
                      <li><a href="#" id="releaseDate">Release Date</a></li>
                      <li><a href="#" id="directorName">Director</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a href="#" id="asc">Asc</a></li>
                      <li><a href="#" id="desc">Desc</a></li>
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
