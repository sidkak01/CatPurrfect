import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  onLogin() {
    console.log('User Logged In:', {
      username: this.username,
      email: this.email,
      password: this.password
    });
    alert('Login Successful!');
  }
}
