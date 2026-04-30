import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.css'
})
export class HeaderNavComponent {

  constructor(
    public authService: AuthService
  ) {}
  
  @Input() headerMessage: string = "Welcome to Movie-Cache";


  logout() {
    console.log("Logging out user...");
    this.authService.signOut().then(() => {
      console.log("User logged out successfully");
    });
  }
}
