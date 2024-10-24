import { Routes } from '@angular/router';
import { HomeFeedComponent } from './home-feed/home-feed.component';
// import { MovieListComponent } from './movie-list/movie-list.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MovieListComponent } from './movie-list/movie-list.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeFeedComponent,
        title: 'Home Page'
    },
    {
        path: 'friends',
        component: FriendsListComponent,
        title: 'Friends List'
    },
    {
        path: 'lists/favorites',
        component: MovieListComponent,
        title: 'Favorite Moviess'
    },
    {
        path:'lists/watchlist',
        component: MovieListComponent,
        title: 'Watchlist'
    },
    {
        path:'lists/*',
        component: MovieListComponent,
        title: 'a different list'
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        title: 'You shouldnt be here'
    }
];
