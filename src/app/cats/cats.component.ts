import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
import { CatService } from '../services/cat.service';

interface Cat {
  name: string;
  weight: string;
  age: string;
  breed: string;
}

@Component({
  selector: 'app-cats',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './cats.component.html',
  styleUrl: './cats.component.css'
})
export class CatsComponent {
  newCat: Cat = {
    name: '',
    weight: '',
    age: '',
    breed: ''
  };

  isLoggedIn = false;
  
  cats: Cat[] = [];

  constructor(private authService: AuthService, private catService: CatService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getLoggedInValue();
    
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  addCat(): void {
    if (this.newCat.name) {
      // Add cat to array (frontend only for now)
      this.cats.push({...this.newCat});

      // Also save to MongoDB
      this.catService.addCat(this.newCat).subscribe({
        next: (savedCat) => {
          console.log('Cat saved to database:', savedCat);
        },
        error: (err) => {
          console.error('Error saving cat to database:', err);
        }
      });
      
      this.newCat = {
        name: '',
        weight: '',
        age: '',
        breed: ''
      };
    }
  }
}
