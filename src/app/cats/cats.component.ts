import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
import { CatService } from '../services/cat.service';
import { GoogleMapsModule } from '@angular/google-maps';

interface Cat {
  name: string;
  weight: string | number;
  age: string | number;
  breed: string;
  location?: {
    lat: number;
    lng: number;
  };
  _id?: string;
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
  isEditing = false;
  
  cats: Cat[] = [];

  selectedCat: Cat | null = null;

  isInteractingWithCatOrMap = false;

  center: google.maps.LatLngLiteral = { lat: 29.65163, lng:  -82.32483 };
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

      if (status) {
        this.loadUserCats();
      }
    });
  }

  refreshLocations(): void {    // Simulating tracking the live location of cats
    if (!this.map) return;
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
  
    this.cats.forEach((cat, index) => {
      // Simulate movement within the general region on the map
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
  
      const newLocation = {
        lat: this.center.lat + latOffset,
        lng: this.center.lng + lngOffset,
      };
  
      this.cats[index] = { ...cat, location: newLocation };
  
      // Update marker on map immediately
      this.updateMarkerForCat(this.cats[index]);
  
      if (cat._id) {  // Update location in db for persistence
        this.catService.updateCat(cat._id, { location: newLocation }).subscribe({
          error: (err) => console.error('Error updating cat location:', err),
        });
      }
    });
  }
  
  loadUserCats(): void {
    const userId = localStorage.getItem('userId')
    
    if (userId) {
      this.catService.getUserCats(userId).subscribe({
        next: (response: any) => {
          const catArray: Cat[] = Array.isArray(response) ? response : [];
          this.cats = catArray;

          if (this.map) {
            this.updateAllMarkers();
          }
        },
        error: (err) => {
          console.error('Error loading user cats:', err);
        }
      });
    }
  }

  onMapInitialized(map: google.maps.Map): void {
    this.map = map;
    this.updateAllMarkers();

    map.addListener('click', () => {
      this.isInteractingWithCatOrMap = true;
    });
  }

  editCat(cat: Cat, event: MouseEvent): void {
    // Prevent the selectCat method from being triggered
    event.stopPropagation();
    
    this.isInteractingWithCatOrMap = true;
    this.isEditing = true;
    this.newCat = { ...cat }; // Copy the cat to the form
  }
  
  deleteCat(cat: Cat, event: MouseEvent): void {
    // Prevent the selectCat method from being triggered
    event.stopPropagation();
    this.isInteractingWithCatOrMap = true;
    
    if (confirm(`Are you sure you want to delete ${cat.name}?`)) {
      if (cat._id) {
        this.catService.deleteCat(cat._id).subscribe({
          next: () => {
            this.cats = this.cats.filter(c => c !== cat);

            if (this.selectedCat === cat) {
              this.selectedCat = null;
            }
            
            this.updateAllMarkers();
          },
          error: (err) => {
            console.error('Error deleting cat:', err);
          }
        });
      } else {
        this.cats = this.cats.filter(c => c !== cat);
        
        if (this.selectedCat === cat) {
          this.selectedCat = null;
        }
        
        this.updateAllMarkers();
      }
    }
  }

  addCat(): void {
    this.isInteractingWithCatOrMap = true;

    if (this.newCat.name) {
      const userId = localStorage.getItem('userId');
    
      if (!userId) {
        console.error('No user ID found');
        return;
      }

      if (this.newCat._id) {
        // Update existing cat if an ID is detected
        this.catService.updateCat(this.newCat._id, this.newCat).subscribe({
          next: (updatedCat) => {
            const index = this.cats.findIndex(cat => cat._id === this.newCat._id);
            if (index !== -1) {
              this.cats[index] = updatedCat;
            }
            
            this.updateAllMarkers();
            
            this.newCat = {
              name: '',
              weight: '',
              age: '',
              breed: ''
            };
            this.isEditing = false;
          },
          error: (err) => {
            console.error('Error updating cat:', err);
          }
        });
      }

      else {
      // Form function as regular add cat
        this.catService.addCat(this.newCat, userId).subscribe({
          next: (savedCat) => {      
            const index = this.cats.findIndex(cat => 
              cat.name === this.newCat.name &&
              cat.breed === this.newCat.breed
            );
            
            if (index !== -1) {
              this.cats[index] = savedCat;
            } else {
              this.cats.push(savedCat);
            }
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

      if (updatedCat._id && typeof updatedCat._id === 'string') {
        this.catService.updateCat(updatedCat._id, { location: position }).subscribe({
          next: (savedCat) => {
            console.log('Cat location updated in database:', savedCat);
          },
          error: (err) => {
            console.error('Error updating cat location:', err);
          }
        });
      } else {
        console.error('Cannot update cat in database: Missing valid _id');
      }
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
