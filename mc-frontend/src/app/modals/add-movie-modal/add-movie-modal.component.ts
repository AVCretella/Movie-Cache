import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-add-movie-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './add-movie-modal.component.html',
  styleUrl: './add-movie-modal.component.css'
})

export class AddMovieModalComponent {
  constructor(
    private movieService: MoviesService,
    private dialogRef: MatDialogRef<AddMovieModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddMovieDialogData
  ) {}

  // @Inject(MAT_DIALOG_DATA) public data: any;

  movieFound = false
  retrievedMovie:Movie = new Movie(""); //TODO initialize with empty movie
  retrievedMoviePosterUrl: string | null = null; //This will be used to display the retrieved poster to the user

  //To start we'll just have the search fields which will be submitted, once a movie comes back then we'll populate the rest
  addMovieForm = new FormGroup({
    //The only two the user will interact with
    movieName: new FormControl('', Validators.required),
    movieReleaseDate: new FormControl('', Validators.pattern(/^\d{4}$/)), //Optional, but if they fill it in it should be a 4 digit year

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
    if (this.addMovieForm.valid) {
      const title = this.addMovieForm.value.movieName as string;
      const yearInput = this.addMovieForm.value.movieReleaseDate as string | null | undefined;
      const year = (yearInput && yearInput.toString().trim() !== '') ? parseInt(yearInput.toString(), 10) : undefined;

      this.movieService.searchForMovie(title, year).subscribe((res) => {
        if (res) {
          console.log("this is the movie we tried to get: ", res)
          this.movieFound = true
          this.retrievedMovie.Title = res.Title
        }
      })
      return this.retrievedMovie
    } else {
      console.log("Fill in all required fields")
      this.addMovieForm.markAllAsTouched();
    }
    return
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}

//When a type isnt passed in, we'll let the user choose where to add the movie after retrieving from omdb
export interface AddMovieDialogData {
  listType?: 'favorites'|'watchlist'|'created'|'saved'|'dnf'|'other';
  prefillName?: string;
}
