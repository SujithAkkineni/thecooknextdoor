import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cook Next Door';

  constructor(private router: Router) {}

  navigateToOrder() {
    this.router.navigate(['/order']);
  }
}
