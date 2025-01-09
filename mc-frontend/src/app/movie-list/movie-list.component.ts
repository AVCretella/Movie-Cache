import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MoviesService } from '../services/movies.service';
import { Title } from '@angular/platform-browser';

import { AddMovieModalComponent } from '../modals/add-movie-modal/add-movie-modal.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

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

  constructor(
    private route: ActivatedRoute,
    private movieService: MoviesService,
    private titleService: Title,
    private dialog: MatDialog
  ) { }

  listType: string | null = null;
  pageTitle: string = "Loading Movies"
  movieList: any = [];

   ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.listType = params.get('listType');
      console.log("url segments: ", params)
      console.log('List were dealing with:', this.listType);

      // Perform conditional checks based on the route path
      if (this.listType === 'favorites') {
        this.pageTitle = "Your Favorites";
        this.movieList = this.movieService.getFavoritesList();
        // Show specific information or perform some action
      } else if (this.listType === 'watchlist') {
        this.pageTitle = "Your Watchlist";
        this.movieList = this.movieService.getWatchlistMovies();
      } else {
        console.log("in the else?")
        this.pageTitle = (this.listType) ? this.listType : this.pageTitle = "Movie List";
        this.pageTitle[0]
        await this.getAllMovies();
      }
      this.titleService.setTitle(this.pageTitle);
    });
  }

  addMovie() {
    console.log("Opened the add movie dialog")
    this.dialog.open(AddMovieModalComponent, {

    })
  }

  async getAllMovies() {   
    // this.movieService.getAllMovies() 
    this.movieService.getAllMovies().subscribe({
      next: (movies) => {
        this.movieList = movies
      },
      error: (err) => {
        console.log("something went wrong: ", err)
        this.movieList = []
      }
    })
  }

  // populateMovieCards() {
  //   //for now just using tempwatchlist
  //   movie
  // }
  
  /* Generic Movies */

  /* Ranked Movies */

  /* Watchlist Movies */
}
