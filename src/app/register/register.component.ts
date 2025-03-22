import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [RouterLink, FormsModule]
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.userService.register(user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        alert('Registration Successful!');
        this.authService.setLoggedIn(true);
        this.router.navigate(['/cats']);
        this.resetForm();
      },
      error: (error) => {
        console.error('Registration failed', error);
        alert('Registration failed: ' + (error.error?.message || 'Please try again.'));
      }
    });
  }

  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }
}