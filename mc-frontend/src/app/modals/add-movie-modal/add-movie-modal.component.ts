import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-movie-modal',
  standalone: true,
  imports: [],
  templateUrl: './add-movie-modal.component.html',
  styleUrl: './add-movie-modal.component.css'
})

export class AddMovieModalComponent {
  constructor(
    private movieService: MoviesService,
    private dialogRef: MatDialogRef<AddMovieModalComponent>
  ) {}

  retrievedMovie = {};
  retrievedMoviePosterUrl: string | null = null; //This will be used to display the retrieved poster to the user

  addMovieForm = new FormGroup({
    //The only two the user will interact with
    movieName: new FormControl('', Validators.required),
    movieReleaseDate: new FormControl(''),

    //These will be disabled
    // moviePoster: new FormControl(''),
    // movieDirector: new FormControl(''),
    // movieActors: new FormControl(''),
    // movieGenre: new FormControl(''),
    // movieSummary: new FormControl(''),
    // movieDuration: new FormControl(''),

    //These will appear after the movie is found from either our db or omdb
    // viewCount: new FormControl(''),
    // personalRating: new FormControl(''),
    // personalReview: new FormControl(''), //For when the user wants to leave their own note on the movie
    // rank: new FormControl('')
  })

  //Consume the form, and make an ombd request
  retrieveMovie() {
    this.movieService.getAllMovies().subscribe((res) => {
      if (res.data) {
        console.log("this is the response for all movies: ", res)
      }
    })
    return this.retrievedMovie
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
