import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { HeaderNavComponent } from './header-nav/header-nav.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { HomeFeedComponent } from './home-feed/home-feed.component';
import { MovieListComponent } from './movie-list/movie-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatIconModule,
    HeaderNavComponent,
    SideNavComponent,
    HomeFeedComponent,
    MovieListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  displayMessage = 'Movie-Cache';
  displayedListTitle = "watchlist";
  movieTypes = ["FAVORITES", "WATCHLIST", "GENERIC"];
  sidenavTabs = ["Favorites", "Watchlist", "Other Lists", "Explore"]
  typeOfMovieList = this.movieTypes[1];
}
