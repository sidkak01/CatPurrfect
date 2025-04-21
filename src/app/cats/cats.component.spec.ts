import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { CatsComponent } from './cats.component';
import { AuthService } from '../services/auth.service';
import { CatService } from '../services/cat.service';
import { of, BehaviorSubject } from 'rxjs';

class MockAuthService {
  private loggedIn = new BehaviorSubject<boolean>(true);

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getLoggedInValue() {
    return this.loggedIn.getValue();
  }

  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }
}

class MockCatService {
  getUserCats(userId: string) {
    return of([]);
  }

  addCat(cat: any, userId: string) {
    return of({});
  }

  updateCat(id: string, cat: any) {
    return of(cat);
  }

  deleteCat(id: string) {
    return of({});
  }
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: () => null
    }
  };
}

beforeAll(() => {
  (globalThis as any).google = {
    maps: {
      Map: class {
        addListener() {}
      },
      LatLngLiteral: class {},
      MapTypeId: { ROADMAP: 'roadmap' },
      Animation: { DROP: 'drop' },
      Marker: class {
        setMap(_: any) {}
        getTitle() {
          return '';
        }
        addListener() {}
      },
      InfoWindow: class {
        constructor(_: any) {}
        open() {}
      }
    }
  };
});

describe('CatsComponent', () => {
  let component: CatsComponent;
  let fixture: ComponentFixture<CatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        CatsComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: CatService, useClass: MockCatService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should load cats when user goes to cats page', () => {
    const mockCats = [
      { name: 'Whiskers', weight: '5', age: '2', breed: 'Bengal', _id: 'abc' }
    ];
    const catService = TestBed.inject(CatService);
    spyOn(catService, 'getUserCats').and.returnValue(of(mockCats));
    localStorage.setItem('userId', '123');
  
    component.ngOnInit(); // It is setup so when the component first loads, the cats API is called to load the current cats from the db
  
    expect(catService.getUserCats).toHaveBeenCalledWith('123');
    expect(component.cats.length).toBe(1);
    expect(component.cats[0].name).toBe('Whiskers');
  });

  it('Should add a new cat', () => {  // Basic adding a cat
    const catService = TestBed.inject(CatService);
    spyOn(catService, 'addCat').and.callThrough();
    localStorage.setItem('userId', '123');
  
    component.newCat = {
      name: 'Mittens',
      weight: '6',
      age: '3',
      breed: 'Siamese'
    };
  
    component.addCat();
  
    expect(catService.addCat).toHaveBeenCalled();
  });

  it('Should update an existing cat', () => {
    const catService = TestBed.inject(CatService);
    spyOn(catService, 'updateCat').and.callThrough();
  
    const existingCat = {
      name: 'Tom',
      weight: '7',
      age: '4',
      breed: 'Persian',
      _id: 'cat123' // Existing cats are linked in the db with the user's _id
    };
  
    component.cats = [existingCat];
    component.newCat = { ...existingCat, name: 'Tommy' };
  
    component.addCat();
  
    expect(catService.updateCat).toHaveBeenCalledWith('cat123', jasmine.any(Object)); // Make sure it is properly updated in db by using the _id
  });

  it('Should delete a cat after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true); // Confirmation is required to delete the cat
    const catService = TestBed.inject(CatService);
    spyOn(catService, 'deleteCat').and.callThrough();
  
    const catToDelete = { name: 'Fluffy', weight: 5, age: 3, breed: 'Persian', _id: '12345' };
    component.cats = [catToDelete];
  
    component.deleteCat(catToDelete, new MouseEvent('click'));
  
    expect(catService.deleteCat).toHaveBeenCalledWith('12345');
  });

});