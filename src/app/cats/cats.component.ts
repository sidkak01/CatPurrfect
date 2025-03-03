import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Cat {
  name: string;
  weight: string;
  age: string;
  breed: string;
}

@Component({
  selector: 'app-cats',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  cats: Cat[] = [];

  addCat(): void {
    if (this.newCat.name) {
      // Add cat to array (frontend only for now)
      this.cats.push({...this.newCat});
      
      this.newCat = {
        name: '',
        weight: '',
        age: '',
        breed: ''
      };
    }
  }
}
