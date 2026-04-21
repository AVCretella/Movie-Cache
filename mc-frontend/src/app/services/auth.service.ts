import { Injectable, inject, signal } from '@angular/core';
import { getAuth, signInWithPopup, GoogleAuthProvider, Auth, updateProfile, user, signOut  } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { catchError, from, mapTo, Observable, tap, throwError } from 'rxjs';
import { UserInterface } from '../user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth); // Observable to track the current user
  currentUserSignal = signal<UserInterface | null | undefined>(undefined); // Signal to track the current user

  constructor(
    private router: Router,
    // private firebaseAuth: Auth
  ) { }

  getUser() {
    return this.user$;
  }

  // private auth = getAuth(); // Initialize the Firebase Auth instance
  register(email: string, username:string, password: string): Observable<void> {
    const createUserPromise = createUserWithEmailAndPassword(
      this.firebaseAuth, email, password
    ).then((response) => {
      updateProfile(response.user, { displayName: username })
      console.log('User registered successfully:', response.user)
    }
    );

    return from(createUserPromise);  // Convert the promise to an observable
  }


  emailSignIn(email: string, password: string): Observable<void> {
    console.log("=== Email sign in from auth service ===")
    if (!email || !password) {
      return throwError(() => new Error('Email and password are required'));
    }
    console.log('All Options:', this.firebaseAuth.app.options);
    console.log('Auth API key:', this.firebaseAuth.app.options.apiKey);
    console.log('Sign in attempt:', { email, passwordLength: password.length });
    console.log('online?', navigator.onLine, email);
    console.log("Attempting to sign in with email and password:" + email + " " + password);
    
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      tap(res => {
        console.log('Firebase signIn response:', res);
        this.currentUserSignal.set({
          email: res.user.email!,
          username: res.user.displayName || ''
        });
      }),
      mapTo(void 0),
      catchError(err => {
        console.error('signIn failure:', err);
        return throwError(() => err);
      })
    );
    
  //   const signInPromise = signInWithEmailAndPassword(
  //     this.firebaseAuth, email, password
  //   )
  //   .then((res) => {
  //     console.log(res)
  //     this.currentUserSignal.set({
  //       email: res.user.email!,
  //       username: res.user.displayName || ''
  //     });
  //   })
  //   .catch(error => {
  //    console.error('Sign-in error:', error);
  //    throw error;
  //  });

  //   return from(signInPromise);  // Convert the promise to an observable
  }

  getCurrentUser() {
    return this.firebaseAuth.currentUser;
  }

  googleSignIn() {
    const provider = new GoogleAuthProvider();  // Create a Google Auth provider
    return signInWithPopup(this.firebaseAuth, provider)
    .then((res)=> {
      console.log("User signed in with Google:", res.user);
      this.currentUserSignal.set({
        email: res.user.email!,
        username: res.user.displayName!
      });
      this.router.navigateByUrl('/');
      return res.user
    });  // Trigger Google sign-in popup
  }

  signOut() {
    return this.firebaseAuth.signOut().then(() => {
      this.currentUserSignal.set(null);
    });
    
    // return this.firebaseAuth.signOut();
  }
}
