import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  onRegister() {
    console.log('User Registered:', {
      username: this.username,
      email: this.email,
      password: this.password
    });
    alert('Registration Successful!');
  }
}
