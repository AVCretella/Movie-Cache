import { Injectable } from '@angular/core';
import { getAuth, signInWithPopup, GoogleAuthProvider  } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private auth = getAuth(); // Initialize the Firebase Auth instance

  getCurrentUser() {
    return this.auth.currentUser;
  }

  googleSignIn() {
    const provider = new GoogleAuthProvider();  // Create a Google Auth provider
    return signInWithPopup(this.auth, provider);  // Trigger Google sign-in popup
  }

  signOut() {
    return this.auth.signOut();
  }
}
