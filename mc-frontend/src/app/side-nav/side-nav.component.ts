import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  @Input() tabNames = ["Tabs Loading"];
}
