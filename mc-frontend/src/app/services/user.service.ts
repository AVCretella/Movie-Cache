import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  createNewUser(email: string, username: string): Observable<void> {
    console.log("Creating new user with email: " + email + " and username: " + username);
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user available when creating user record');
    }

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userData = {
      email,
      username,
      favoritesList: [],
      watchList: [],
      topPriorityWatchList: {},
      savedListsIds: [],
      createdListsIds: [],
      DNFList: [],
      friendIds: [],
      friendMovieReccs: [],
      onlineStatus: true,
      preferences: {}
    };

    return from(setDoc(userDocRef, userData));
  }
  
  getUserInfo() {
    return {
      userName: "floorsalami",
      favoritesList: [],
      watchList: [],
      otherListIDs: [
        {
          id: 1,
          title: "my other list"
        }, 
        {
          id: 2,
          title: "the second extra list"
        }
      ],
      savedListIDs: [],
      friendsIDs: [],
      friendReccs: []
    }
  }
}
