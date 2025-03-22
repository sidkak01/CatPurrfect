import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getLoggedInValue();
    
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  logout(): void {
    this.authService.setLoggedIn(false);
    this.router.navigate(['/']);
  }
}