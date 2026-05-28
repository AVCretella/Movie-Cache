import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Firestore, collection, query, where, getDocs, doc, addDoc, setDoc } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private firestore: Firestore
  ) { }

  getAllMovies(): Observable<any> {
    return this.http.get("http://localhost:3000/movies");
  }

  getWatchlistMovies() {
    return this.testWatchlistData;
  }

  getFavoritesList() {
    return this.testFavoritesList;
  }

  //TODO This will initially search our firestore, and if it isn't there it'll hit the omdb api
  searchForMovie(title: any, year?: Number): Observable<any> {
    const movieTitle = (title || '').toString().toLowerCase().trim();
    if (!movieTitle) {
      console.log("NO MOVIE TITLE PROVIDED")
      return of(null);
    }

    try {
      const moviesCol = collection(this.firestore, 'Movie');
      let q = null;

      if (year && Number.isInteger(year)) { //If user provides the year, include it in the query
        q = query(moviesCol, where('TitleLower', '==', movieTitle), where('Year', '==', year));
      } else {
        q = query(moviesCol, where('TitleLower', '==', movieTitle));
      }

      // getDocs returns a Promise, convert to Observable and map to either
      // the first Firestore hit or the backend OMDB call.
      return from(getDocs(q)).pipe(
        switchMap((snapshot: any) => {
          if (snapshot && !snapshot.empty && snapshot.docs.length > 0) {
            const doc = snapshot.docs[0];
            const data = doc.data();
            console.log("Found in Firestore!: ", data)
            const mapped = this.mapMovieData(data);
            return of(mapped);
          }

          //If we have to go to OMDB for this movie and it comes back with something, store it in the db regardless
          console.log("had to go to omdb for: ", { title, year });
          return this.callOmdb(title, year).pipe(
            switchMap((omdbRes: any) => {
              if (omdbRes && omdbRes.Response === "True") {
                const mappedRes = this.mapMovieData(omdbRes) //Make sure it fits our format before we put it in the db
                console.log("got this back from omdb: ", omdbRes);
                return from(setDoc(doc(moviesCol, omdbRes.imdbID), mappedRes)).pipe(
                  map(() => mappedRes)
                );
              }
              return of(omdbRes);
            })
          );
        })
      );
    } catch (err) {
      // If any runtime error occurs, fallback to OMDB
      return this.callOmdb(title, year);
    }
  }

  //Will take a firestore or OMDB object and convert it
  private mapMovieData(data: any) {
    if (!data) { return null; }

    return {
      "Actors": data.Actors,
      "Awards": data.Awards,
      "BoxOffice": data.BoxOffice,
      "Country": data.Country,
      "DVD": data.DVD,
      "Director": data.Director,
      "Genre": data.Genre,
      "Language": data.Language,
      "Metascore": data.Metascore,
      "Plot": data.Plot,
      "Poster": data.Poster,
      "Production": data.Production,
      "Rated": data.Rated,
      "Ratings": data.Ratings,
      "Released": data.Released,
      "Response": data.Response,
      "Runtime": data.Runtime,
      "Title": data.Title,
      "TitleLower": data.Title ? data.Title.toString().toLowerCase().trim() : '', //Need this since Firestore searches are case sensitive - could move to elasticsearch if i really care
      "Type": data.Type,
      "Website": data.Website,
      "Writer": data.Writer,
      "Year": data.Year,
      "imdbID": data.imdbID,
      "imdbRating": data.imdbRating,
      "imdbVotes": data.imdbVotes
    };
  };

  private callOmdb(title: any, year?: Number): Observable<any> {
    const apiKey = (environment as any).OMDB_API_KEY || '';
    const base = (environment as any).BASE_OMDB_URL || 'https://www.omdbapi.com/?t=';
    const encoded = encodeURIComponent(title || '');
    const yearParam = year ? `&y=${year}` : '';
    const url = `${base}${encoded}${yearParam}&apikey=${apiKey}`;
    return this.http.get(url);
  }

  //TODO will need a refresh button maybe for admins to update the movie in our db with the omdb version

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
}