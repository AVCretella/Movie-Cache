import { Component, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css', '../app.component.css']
})
export class MovieCardComponent {
  @Input() listType: String | null = "favoritesList";
  @Input() movieInfo: any = {};
  @Output() rankChange = 0; //A number that will correlate to the # of places a movie will move up or down on the ranked list
  
  ngOnInit() {
    console.log("movie info passed: ", this.movieInfo)
  }
  
  
  /* =================== All 'Favorite' Movies Functionality =================== */
  
  changeRank() {
    //TODO call the database to say this movie is movie up in rank,
    //then send an event to the output with the respective change amount
  }


  /* =================== All 'Watchlist' Movies Functionality =================== */
  addToFavorites() {

  }

  /* =================== All 'Other List' Movies Functionality =================== */
  //If you're on a random list, you can add it to your watchlist
  addToWatchlist() {

  }
  
}
