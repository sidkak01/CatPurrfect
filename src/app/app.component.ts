import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { GoogleMapsModule } from '@angular/google-maps'
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, GoogleMapsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
  }
}