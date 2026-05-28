import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MoviesService } from '../../services/movies.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { LucideStar } from '@lucide/angular';
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
    CommonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    LucideStar
  ],
  templateUrl: './add-movie-modal.component.html',
  styleUrl: './add-movie-modal.component.css'
})

export class AddMovieModalComponent implements OnInit {
  constructor(
    private movieService: MoviesService,
    private dialogRef: MatDialogRef<AddMovieModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddMovieDialogData
  ) {
    this.listType = this.data?.listType || 'favorites';
  }

  movieFound = false;
  readyToSwapForms = false;
  listType: 'favorites'|'watchlist'|'created'|'saved'|'dnf'|'other' | undefined = 'favorites';
  retrievedMovie: Movie = new Movie("");
  retrievedMovieData: any = null;
  hoverRating = 0;

  //Search form
  searchForm = new FormGroup({
    movieName: new FormControl('', Validators.required),
    movieReleaseDate: new FormControl('', Validators.pattern(/^\d{4}$/)),
  });

  //Details form - will be populated based on listType
  favoritesForm: FormGroup = new FormGroup({
    rank: new FormControl('', [Validators.required, Validators.min(0)]),
    rating: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
    review: new FormControl('', Validators.required),
    userNotes: new FormControl(''),
    timesSeen: new FormControl('', [Validators.required, Validators.min(0)])
  });

  watchlistForm: FormGroup = new FormGroup({
    interestLevel: new FormControl('', Validators.required),
    groupStatus: new FormControl('', Validators.required),
    userNotes: new FormControl(''),
    overallTopPriority: new FormControl(false),
    genreTopPriority: new FormControl(false)
  });

  genericMovieForm: FormGroup = new FormGroup({
      userNotes: new FormControl('')
  });

  ngOnInit() {
    // this.initializeForms();
  }

  // private initializeForms() {

  //   this.favoritesForm = new FormGroup({
  //     rank: new FormControl('', [Validators.required, Validators.min(0)]),
  //     rating: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
  //     review: new FormControl('', Validators.required),
  //     userNotes: new FormControl(''),
  //     timesSeen: new FormControl('', [Validators.required, Validators.min(0)])
  //   });

  //   this.watchlistForm = new FormGroup({
  //     interestLevel: new FormControl('', Validators.required),
  //     groupStatus: new FormControl('', Validators.required),
  //     userNotes: new FormControl(''),
  //     overallTopPriority: new FormControl(false),
  //     genreTopPriority: new FormControl(false)
  //   });

  //   this.genericMovieForm = new FormGroup({
  //     userNotes: new FormControl('')
  //   });
  // }

  //Consume the search form and make an omdb request
  retrieveMovie() {
    if (this.searchForm.valid) {
      const title = this.searchForm.value.movieName as string;
      const yearInput = this.searchForm.value.movieReleaseDate as string | null | undefined;
      const year = (yearInput && yearInput.toString().trim() !== '') ? parseInt(yearInput.toString(), 10) : undefined;

      this.movieService.searchForMovie(title, year).subscribe((res) => {
        if (res) {
          console.log("this is the movie we tried to get: ", res);
          this.movieFound = true;
          this.retrievedMovieData = res;
          this.retrievedMovie.Title = res.Title;
        }
      });
    } else {
      console.log("Fill in all required fields");
      this.searchForm.markAllAsTouched();
    }
  }

  //User can swap between the lists they want to be adding movies to
  changeListType(newType: 'favorites'|'watchlist'|'created'|'saved'|'dnf'|'other'|undefined) {
    this.listType = newType || 'favorites';
  }

  //Set star rating
  setRating(rating: number) {
    this.favoritesForm.get('rating')?.patchValue(rating)
  }

  //Get array for star rendering
  getStars(): number[] {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  //Submit the details form after movie is found
  submitMovie() {
    if (this.listType === 'favorites' && this.favoritesForm.valid) {
      let movieData: any = {};
      if (this.listType === 'favorites') {

        movieData = {
          ...this.favoritesForm.value
        };
      }
      console.log("Submitting movie:", movieData);
      this.dialogRef.close(movieData);
    } else {
      console.log("Fill in all required fields");
      this.favoritesForm.markAllAsTouched();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// //When a type isnt passed in, we'll let the user choose where to add the movie after retrieving from omdb
export interface AddMovieDialogData {
  listType?: 'favorites'|'watchlist'|'created'|'saved'|'dnf'|'other';
  prefillName?: string;
}