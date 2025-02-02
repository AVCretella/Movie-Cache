import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

//For firebase auth
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  // emailForm = new FormGroup({
  //   email: new FormControl("", Validators.required),
  //   password: new FormControl("", Validators.required)
  // })
  // email: string = '';
  // password: string = '';
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  //Allow the user to sign in with Google
  googleSignIn() {
    this.authService.googleSignIn().then(res => {
      console.log("holy shit signed in with google", res);
    }).catch(error => {
      this.errorMessage = error.message;
    });
  }
}
