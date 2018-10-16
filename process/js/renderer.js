//copy and paste libraries here
var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');

//eRequire to show that we are working with node now
var fs = eRequire('fs');
//Will go to the dataLocation defined in index.html and create a proper data file from the file there
var loadMovies = JSON.parse(fs.readFileSync(dataLocation));



var React = require('react');
var ReactDOM = require('react-dom');
var MovieList = require('./MovieList')
//The main react component
var MainInterface = React.createClass({
  //this will load the retrieved data into an object for this component
  getInitialState: function(){
    return {
      myMovies: loadMovies
    } //return
  },
  render: function(){
    //save that object to a variable that we can refer to and manipulate
    var userMovies = this.state.myMovies;
    return(
      //a basic way to show one of the movies in that dataset, will turn into a list
      <div className="application">
        <div className="container">
         <div className="row">
           <div className="movies col-sm-12">
             <h2 className="movies-headline">Watched Movies</h2>
             <ul className="item-list media-list">

               <li className="movie-item media">
                 <div className="movie-info media-body">
                   <div className="movie-head">
                     <span className="movie-name">{userMovies[0].movieName}</span>
                     <span className="release-date pull-right">{userMovies[0].releaseDate}</span>
                   </div>
                   <div className="director-name"><span className="label-item">Directed By:</span>
                   {userMovies[0].directorName}</div>
                   <div className="movie-notes">{userMovies[0].Summary}</div>
                 </div>
               </li>

             </ul>
           </div>{/* col-sm-12 */}
         </div>{/* row */}
        </div>{/* container */}
      </div>
    );
  }
});

//inject the component into the div with ID = movieInfo
ReactDOM.render(
  <MainInterface />,
  document.getElementById('movieInfo')
);

// $(function(){
//   $('#movieInfo').append('<h3 class="text-success"> Movie Info Loaded </h3>')
// })
