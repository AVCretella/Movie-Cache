import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddMovieModalComponent } from '../modals/add-movie-modal/add-movie-modal.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    MatDialogModule,
    AddMovieModalComponent
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})

export class SideNavComponent {
  constructor (
    private user: UserService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  @Input() tabNames = ["Tabs Loading"];
  // userInfo = null
  
  ngOnInit() {
    // this.userInfo = this.authService.getCurrentUser();
    // console.log("this is the user's information: ", this.userInfo)
  }

  addMovie() {
    this.dialog.open(AddMovieModalComponent);
  }
}
