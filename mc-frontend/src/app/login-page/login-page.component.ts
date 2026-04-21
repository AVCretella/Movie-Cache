import { Component, OnInit} from '@angular/core';
import { AuthService } from '../services/auth.service';
import { input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { signInWithEmailAndPassword } from 'firebase/auth';

//For firebase auth
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatError,
    CommonModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  nonForm_email: string = '';
  nonForm_password: string = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    console.log('firebase options', this.authService.firebaseAuth.app.options);

    // this.registrationForm = this.fb.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required, Validators.minLength(6)]]
    // });
  }


  emailSignIn(): void {
    let rawEmailSignin = this.loginForm.value as { email: string, password: string };
    console.log("Attempting to sign in with email and password: ", rawEmailSignin.email, rawEmailSignin.password)
    // console.log(this.nonForm_email, this.nonForm_password)
    
    // this.authService.emailSignIn('newemail@gmail.com', 'newemail').subscribe({
    //   next: () => console.log('hard-coded signin success'),
    //   error: err => console.error('hard-coded signin error', err)
    // });
        
    
    
    this.authService.emailSignIn(rawEmailSignin.email, rawEmailSignin.password)
      // .emailSignIn(this.nonForm_email, this.nonForm_password)
      .subscribe({
        next: () => {
          console.log("User signed in successfully");
          this.errorMessage = null;
          this.router.navigateByUrl('/home');
        },
        error: (error) => {
          console.error("Error signing in user:", error);
          this.errorMessage = error.message;
        }
    })
  }

  //TODO need to handle when it's a duplicate email error
  emailRegister() {
    let rawEmailReg = this.registrationForm?.getRawValue() as { email: string, username: string, password: string };
    console.log("we're clearly grabbibng theinfo: ",rawEmailReg)
    this.authService.register(rawEmailReg.email, rawEmailReg.username, rawEmailReg.password)
    .subscribe({
      next: () => {
        console.log("User registered successfully");
        console.log("trying to auto-login")
        this.authService.emailSignIn(rawEmailReg.email, rawEmailReg.password)
        .subscribe({
          next: () => {
            console.log('Auto-signed in after registration');
            this.router.navigateByUrl('/');  // Or your desired route
          },
          error: (error) => {
            console.error('Auto-sign-in failed:', error);
            this.errorMessage = 'Registration successful, but sign-in failed: ' + error.message;
          }
        });
        // this.router.navigateByUrl('/home')
      },
      error: (error) => {
        console.error("Error registering user: It's likely this user already exists", error);
        this.errorMessage = error.message;
      }
    });
  }

  //Allow the user to sign in with Google
  googleSignIn() {
    this.authService.googleSignIn().then(res => {
      console.log("holy shit signed in with google", res);
    }).catch(error => {
      this.errorMessage = error.message;
    });
  }

  googleRegister() {

  }


}
