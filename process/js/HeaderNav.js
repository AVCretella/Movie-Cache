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

  handleGenre: function(event){
    this.props.filterGenre(event.target.id);
  },

  //this is basically just a bootstap header, with className for react like usual
  //each of the serach options is clickable and will dynamically change the list
  render: function(){
  //
  // const props = this.props;
  // let sortFieldItems = [];
  //   props.sortFields.forEach( function(sortFieldObject){
  //     if (sortFieldObject.field == 'genres') {
  //       sortFieldItems.push(
  //         <div className= "input-group-btn">
  //           <button type="button" className="btn btn-info dropdown-toggle"
  //             data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Genre &nbsp;
  //             <span className="caret"></span>
  //           </button>
  //           {/*<ul className="dropdown-menu dropdown-menu-right">
  //             <li><a href="#" id={sortFieldObject.field} onClick={this.handleSort}>{sortFieldObject.displayName}</a></li>
  //           </ul> */}
  //         </div>
  //       );
  //     } else {
  //       sortFieldItems.push(<li><a href="#" id={sortFieldObject.field} onClick={this.handleSort}>{sortFieldObject.displayName} {(props.orderBy === sortFieldObject.field) ? <span className="glyphicon glyphicon-ok"></span>:null}</a></li>);
  //       // return <li><a href="#" id={sortField.field} onClick={this.handleSort}> {sortField.displayName} {(this.props.orderBy === sortField.field) ? <span className="glyphicon glyphicon-ok"></span>:null}</a></li>;
  //     }
  //   });

    // var preliminaryItems = this.props.sortFields.filter(function (sortFieldObject) {
    //   return sortFieldObject.field != "genres";
    // });
    let genreItems = this.props.genreItems.map((genre) =>
      <li><a href="#" id={genre} onClick={this.handleGenre}> {genre} {(this.props.genre === genre) ? <span className="glyphicon glyphicon-ok"></span>:null}</a></li>
    );

    let sortFieldItems = this.props.sortFields.map((sortField) =>
      <li>
        <a href="#" id={sortField.field} onClick={this.handleSort}> {sortField.displayName}
          {(this.props.orderBy === sortField.field) ? <span className="glyphicon glyphicon-ok"></span>:null}
        </a>
      </li>
    );

    return(
      <nav className="navigation navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header"><a className="navbar-brand" href="#">Movie Cache</a></div>
          <div className="navbar-form navbar-right search-movies">
              <div className="input-group">
                <input id="SearchMovies" onChange={this.handleSearch} placeholder="Search" autoFocus type="text" className="form-control" aria-label="Search Movies" />
                <div className="input-group-btn">
                  <button type="button" className="btn btn-info dropdown-toggle"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Sort by &nbsp;
                    <span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-right">
                    {sortFieldItems}
                    <li role="separator" className="divider"></li>
                    <li><a href="#" id="asc" onClick={this.handleOrder}>Asc {(this.props.orderDir === 'asc') ? <span className="glyphicon glyphicon-ok"></span>:null}</a></li>
                    <li><a href="#" id="desc" onClick={this.handleOrder}>Desc  {(this.props.orderDir === 'desc') ? <span className="glyphicon glyphicon-ok"></span>:null}</a></li>
                  </ul>
                </div>{/* input-group-btn */}
            </div>{/* input-group */}

            <div className="input-group">
              <div className="genre-selection">
                <button type="button" className="btn btn-info dropdown-toggle"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Genre &nbsp;
                  <span className="caret"></span>
                </button>
                <ul className="dropdown-menu dropdown-menu-right">
                  {genreItems}
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
