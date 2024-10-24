import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MovieCardComponent
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent {

  constructor(private route: ActivatedRoute) { }

  pageTitle: String = "Loading List";
  listType: String | null = "other list";
  movieList: any = [];

   ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      this.listType = urlSegments.map(segment => segment.path).join('/');
      console.log('List were dealing with:', this.listType);

      // Perform conditional checks based on the route path
      if (this.listType === 'lists/favorites') {
        this.pageTitle = 'Your Favorites';
        this.movieList = this.testFavoritesList;
        // Show specific information or perform some action
      } else if (this.listType === 'lists/watchlist') {
        this.pageTitle = 'Your Watchlist';
        this.movieList = this.testWatchlistData;
      } else {
        this.pageTitle = this.listType;
        this.movieList = this.testWatchlistData;
      }

    });
  }

  // populateMovieCards() {
  //   //for now just using tempwatchlist
  //   movie
  // }

  testWatchlistData = [
    {
      "movieName":"Treasure Planet",
      "posterURL":"https://m.media-amazon.com/images/M/MV5BMTQ0NDg3MjU2OV5BMl5BanBnXkFtZTYwODgyMDg5._V1_SX300.jpg",
      "directorName":"Ron Clements, John Musker",
      "actors":"Roscoe Lee Browne, Corey Burton, Dane A. Davis, Joseph Gordon-Levitt",
      "releaseDate":2002,
      "Summary":"A Disney animated version of \"Treasure Island\". The only difference is that the film is set in outer space with alien worlds and other galactic wonders.",
      "duration":95
    },
    {
      "movieName":"Tomb Raider",
      "posterURL":"https://m.media-amazon.com/images/M/MV5BOTY4NDcyZGQtYmVlNy00ODgwLTljYTMtYzQ2OTE3NDhjODMwXkEyXkFqcGdeQXVyNzYzODM3Mzg@._V1_SX300.jpg",
      "directorName":"Roar Uthaug",
      "actors":"Alicia Vikander, Dominic West, Walton Goggins, Daniel Wu",
      "releaseDate":2018,
      "Summary":"Lara Croft, the fiercely independent daughter of a missing adventurer, must push herself beyond her limits when she discovers the island where her father disappeared.",
      "duration":119
    },
    {
      "movieName":"The Lost City of Z",
      "posterURL":"https://m.media-amazon.com/images/M/MV5BMjQzNTk3MTkyNF5BMl5BanBnXkFtZTgwMDA2MDQzMTI@._V1_SX300.jpg",
      "directorName":"James Gray",
      "actors":"Charlie Hunnam, Robert Pattinson, Sienna Miller, Tom Holland",
      "releaseDate":2016,
      "Summary":"A true-life drama, centering on British explorer Col. Percival Fawcett, who disappeared whilst searching for a mysterious city in the Amazon in the 1920s.",
      "duration":141
    },
    {
      "movieName":"Hidden Figures",
      "posterURL":"https://m.media-amazon.com/images/M/MV5BMzg2Mzg4YmUtNDdkNy00NWY1LWE3NmEtZWMwNGNlMzE5YzU3XkEyXkFqcGdeQXVyMjA5MTIzMjQ@._V1_SX300.jpg",
      "directorName":"Theodore Melfi",
      "actors":"Taraji P. Henson, Octavia Spencer, Janelle Monáe, Kevin Costner",
      "releaseDate":2016,
      "Summary":"The story of a team of female African-American mathematicians who served a vital role in NASA during the early years of the U.S. space program.",
      "duration":127
    },
    {
      "movieName":"Blood Diamond",
      "posterURL":"https://m.media-amazon.com/images/M/MV5BZmNjOTEyMzEtNWJiMy00Njg5LTk2OTctMDk3MmEwOWQyZTgzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
      "directorName":"Edward Zwick",
      "actors":"Leonardo DiCaprio, Djimon Hounsou, Jennifer Connelly, Kagiso Kuypers",
      "releaseDate":2006,
      "Summary":"A fisherman, a smuggler, and a syndicate of businessmen match wits over the possession of a priceless diamond.",
      "duration":143
    }
  ]

  testFavoritesList = [
    {
      "movieName":"Lady Bird",
      "posterURL":"https://m.media-amazon.com/images/M/MV5BODhkZGE0NDQtZDc0Zi00YmQ4LWJiNmUtYTY1OGM1ODRmNGVkXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
      "directorName":"Greta Gerwig",
      "actors":["Saoirse Ronan",
      "Laurie Metcalf",
      "Tracy Letts",
      "Lucas Hedges"],
      "genres":["Comedy",
      "Drama"],
      "releaseDate":2017,
      "Summary":"In 2002, an artistically inclined seventeen-year-old girl comes of age in Sacramento, California.",
      "duration":94,
      "viewCount":1,
      "personalRating":10,
      "rank":1
    },
    {
      "movieName":"BlacKkKlansman",
      "posterURL":"https://m.media-amazon.com/images/M/MV5BMjUyOTE1NjI0OF5BMl5BanBnXkFtZTgwMTM4ODQ5NTM@._V1_SX300.jpg",
      "directorName":"Spike Lee",
      "actors":["Alec Baldwin",
      "John David Washington",
      "Isiah Whitlock Jr.",
      "Robert John Burke"],
      "genres":["Biography",
      "Crime",
      "Drama"],
      "releaseDate":2018,
      "Summary":"Ron Stallworth, an African American police officer from Colorado Springs, CO, successfully manages to infiltrate the local Ku Klux Klan branch with the help of a Jewish surrogate who eventually becomes its leader. Based on actual events.",
      "duration":135,
      "viewCount":2,
      "personalRating":9.9,
      "rank":2
    },
    {
      "movieName":"The Prestige",
      "posterURL":"https://m.media-amazon.com/images/M/MV5BMjA4NDI0MTIxNF5BMl5BanBnXkFtZTYwNTM0MzY2._V1_SX300.jpg",
      "directorName":"Christopher Nolan",
      "actors":["Hugh Jackman",
      "Christian Bale",
      "Michael Caine",
      "Piper Perabo"],
      "genres":["Drama",
      "Mystery",
      "Sci-Fi",
      "Thriller"],
      "releaseDate":2006,
      "Summary":"After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
      "duration":130,
      "viewCount":4,
      "personalRating":9.6,
      "rank":3
    },
    {
      "movieName":"Avatar",
      "posterURL":"https://m.media-amazon.com/images/M/MV5BMTYwOTEwNjAzMl5BMl5BanBnXkFtZTcwODc5MTUwMw@@._V1_SX300.jpg",
      "directorName":"James Cameron",
      "actors":["Sam Worthington",
      "Zoe Saldana",
      "Sigourney Weaver",
      "Stephen Lang"],
      "genres":["Action",
      "Adventure",
      "Fantasy",
      "Sci-Fi"],
      "releaseDate":2009,
      "Summary":"A paraplegic marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
      "duration":162,
      "viewCount":5,
      "personalRating":9.3,
      "rank":4
    },
    {
      "movieName":"TRON: Legacy",
      "posterURL":"https://m.media-amazon.com/images/M/MV5BMTk4NTk4MTk1OF5BMl5BanBnXkFtZTcwNTE2MDIwNA@@._V1_SX300.jpg",
      "directorName":"Joseph Kosinski",
      "actors":["Jeff Bridges",
      "Garrett Hedlund",
      "Olivia Wilde",
      "Bruce Boxleitner"],
      "genres":["Action",
      "Adventure",
      "Sci-Fi"],
      "releaseDate":2010,
      "Summary":"The son of a virtual world designer goes looking for his father and ends up inside the digital world that his father designed. He meets his father's corrupted creation and a unique ally who was born inside the digital world.",
      "duration":125,
      "viewCount":9,
      "personalRating":9.3,
      "rank":5
    }
  ]
  
  /* Generic Movies */

  /* Ranked Movies */

  /* Watchlist Movies */
}
