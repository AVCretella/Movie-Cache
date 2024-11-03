import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user'

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  constructor (
    private user: UserService
  ) {}

  @Input() tabNames = ["Tabs Loading"];
  userInfo = new User(
    {}
  );
  
  ngOnInit() {
    this.userInfo = this.user.getUserInfo();
    console.log("this is the user's information: ", this.userInfo)
  }
}
