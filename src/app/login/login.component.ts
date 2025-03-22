import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [RouterLink, FormsModule]
})
export class LoginComponent {
  username = '';
  email = '';
  password = '';

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  onLogin() {
    console.log('User Logged In:', {
      username: this.username,
      email: this.email,
      password: this.password
    });
    alert('Login Successful!');
    this.authService.setLoggedIn(true);
    this.router.navigate(['/cats']);
  }
}
