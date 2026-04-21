import { Component, OnInit, OnChanges, SimpleChanges, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
// import { User } from '@angular/fire/auth';
// import { AngularFireModule } from '@angular/fire/compat';

// import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Import for auth
// import { environment } from '../environments/environment';


import { HeaderNavComponent } from './header-nav/header-nav.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { HomeFeedComponent } from './home-feed/home-feed.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserInterface } from './user.interface';
// import { AngularFireModule } from '@angular/fire/compat'
// import { AngularFireAuthModule } from '@angular/fire/compat/auth'
// import { environment } from '../environments/environment';

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
    MovieListComponent,
    LoginPageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // user: User | null = null;
  user: UserInterface | null | undefined = null;
  displayMessage = 'Movie-Cache';
  displayedListTitle = "watchlist";
  // movieTypes = ["FAVORITES", "WATCHLIST", "GENERIC"];
  sidenavTabs = ["Favorites", "Watchlist", "Other Lists", "Info", "Contact Us"]
  // typeOfMovieList = this.movieTypes[1];

  constructor(public authService: AuthService) {
    effect(() => {
      this.user = this.authService.currentUserSignal();
      if (this.user) {
        // User is logged in, navigate or update UI as needed
        console.log('User logged in in constructor:', this.user);
      } else {
        // User is logged out
        console.log('User logged out');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log("ngOnChanges called");
    // this.authService.user$.subscribe((user: any) => {
    //   if (user) {
    //     this.user = user.email;
    //     this.authService.currentUserSignal.set({
    //       email: user.email!,
    //       username: user.displayName!,
    //     });
    //   } else {
    //     this.user = null;
    //     this.authService.currentUserSignal.set(null);
    //   }
    // });
  }


  ngOnInit(): void {
    // this.authService.user$.subscribe((user: any) => {
    //   if (user) {
    //     this.authService.currentUserSignal.set({
    //       email: user.email!,
    //       username: user.displayName!,
    //     });
    //   } else {
    //     this.authService.currentUserSignal.set(null);
    //   }
    // });
  }

  logout() {
    console.log("Logging out user");
    this.authService.signOut().then(() => {
      console.log("User logged out successfully"); 
      this.user = null; // Clear the user state
    }).catch(error => {
      console.error("Logout failed", error);
    });
    // this.authService.logout().then(() => {
    //   console.log("User logged out successfully");
    //   this.user = null; // Clear the user state
    // }).catch(error => {
    //   console.error("Logout failed", error);
    // });
  }
}
