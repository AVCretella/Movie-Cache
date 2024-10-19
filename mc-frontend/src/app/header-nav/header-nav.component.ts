import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [
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
  @Input() headerMessage: string = "Welcome to Movie-Cache";
}
