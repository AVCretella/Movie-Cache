import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Import for auth
// import { environment } from '../environments/environment';


import { HeaderNavComponent } from './header-nav/header-nav.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { HomeFeedComponent } from './home-feed/home-feed.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { LoginPageComponent } from './login-page/login-page.component';
// import { AngularFireModule } from '@angular/fire/compat'
// import { AngularFireAuthModule } from '@angular/fire/compat/auth'
// import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // AngularFireModule.initializeApp(environment.firebase)
    AngularFireModule,
    RouterOutlet,
    CommonModule,
    MatIconModule,
    HeaderNavComponent,
    SideNavComponent,
    HomeFeedComponent,
    MovieListComponent,
    LoginPageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  user: User | null = null;
  displayMessage = 'Movie-Cache';
  displayedListTitle = "watchlist";
  // movieTypes = ["FAVORITES", "WATCHLIST", "GENERIC"];
  sidenavTabs = ["Favorites", "Watchlist", "Other Lists", "Info", "Contact Us"]
  // typeOfMovieList = this.movieTypes[1];

  constructor(private authService: AuthService) {}

  // ngOnInit(): void {
  //   // Listen for changes in the authentication state
  //   this.authService.listenToAuthState(user => {
  //     this.user = user;
  //   });
  // }
}
