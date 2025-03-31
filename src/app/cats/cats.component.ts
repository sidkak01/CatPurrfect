import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
import { CatService } from '../services/cat.service';
import { GoogleMapsModule } from '@angular/google-maps';

interface Cat {
  name: string;
  weight: string;
  age: string;
  breed: string;
  location?: {
    lat: number;
    lng: number;
  };
}


@Component({
  selector: 'app-cats',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, GoogleMapsModule],
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

  selectedCat: Cat | null = null;

  isInteractingWithCatOrMap = false;

  center: google.maps.LatLngLiteral = { lat: 40.7128, lng: -74.0060 };
  zoom = 10;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  map: google.maps.Map | null = null;
  markers: google.maps.Marker[] = [];

  constructor(private authService: AuthService, private catService: CatService) {}

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.isInteractingWithCatOrMap) {
      this.deselectCat();
    }
    this.isInteractingWithCatOrMap = false;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getLoggedInValue();
    
    this.authService.isLoggedIn().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  onMapInitialized(map: google.maps.Map): void {
    this.map = map;
    this.updateAllMarkers();

    map.addListener('click', () => {
      this.isInteractingWithCatOrMap = true;
    });
  }

  addCat(): void {
    this.isInteractingWithCatOrMap = true;

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

  selectCat(cat: Cat, event?: MouseEvent): void {
    this.isInteractingWithCatOrMap = true;
    if (event) {
      event.stopPropagation();
    }
    this.selectedCat = cat;
    
    if (cat.location) {
      this.center = cat.location;
      this.zoom = 14;
    }
  }

  deselectCat(): void {
    this.selectedCat = null;
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    this.isInteractingWithCatOrMap = true;

    if (!this.selectedCat || !event.latLng || !this.map) return;
    
    const position = event.latLng.toJSON();
    
    const catIndex = this.cats.findIndex(cat => cat === this.selectedCat);
    if (catIndex !== -1) {
      const updatedCat = {
        ...this.cats[catIndex],
        location: position
      };
      
      this.cats[catIndex] = updatedCat;
      
      this.selectedCat = updatedCat;
      
      this.updateMarkerForCat(updatedCat);
    }
  }

  onFormInteraction(event: Event): void {
    this.isInteractingWithCatOrMap = true;
    event.stopPropagation();
  }
  
  updateAllMarkers(): void {
    if (!this.map) return;
    
    this.clearAllMarkers();
    
    this.cats.forEach(cat => {
      if (cat.location) {
        this.addMarkerForCat(cat);
      }
    });
  }
  
  addMarkerForCat(cat: Cat): void {
    if (!cat.location || !this.map) return;
    
    const existingMarkerIndex = this.markers.findIndex(
      marker => marker.getTitle() === cat.name
    );
    
    if (existingMarkerIndex !== -1) {
      this.markers[existingMarkerIndex].setMap(null);
      this.markers.splice(existingMarkerIndex, 1);
    }
    
    const marker = new google.maps.Marker({
      position: cat.location,
      map: this.map,
      title: cat.name,
      animation: google.maps.Animation.DROP,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
      }
    });
    
    marker.addListener('click', () => {
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h5 style="margin-top: 0; color: #D35400;">${cat.name}</h5>
            ${cat.breed ? `<p><strong>Breed:</strong> ${cat.breed}</p>` : ''}
            ${cat.age ? `<p><strong>Age:</strong> ${cat.age}</p>` : ''}
            ${cat.weight ? `<p><strong>Weight:</strong> ${cat.weight}</p>` : ''}
          </div>
        `
      });
      
      infoWindow.open(this.map, marker);
    });
    
    this.markers.push(marker);
  }
  
  updateMarkerForCat(cat: Cat): void {
    if (!cat.location) return;
    
    const existingMarkerIndex = this.markers.findIndex(
      marker => marker.getTitle() === cat.name
    );
    
    if (existingMarkerIndex !== -1) {
      this.markers[existingMarkerIndex].setMap(null);
      this.markers.splice(existingMarkerIndex, 1);
    }
    
    this.addMarkerForCat(cat);
  }
  
  clearAllMarkers(): void {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  }
  
  getMarkerOptions(cat: Cat): google.maps.MarkerOptions {
    return {
      title: cat.name,
      animation: google.maps.Animation.DROP,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png'
      }
    };
  }
}
