import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { CatsComponent } from './cats.component';
import { AuthService } from '../services/auth.service';
import { CatService } from '../services/cat.service';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

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

  editCat(id: string, cat: any) {
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
  (globalThis as any).google = {  // Mocking the Google Maps component
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

    localStorage.setItem('userId', 'user123');  // UserId is required for editing the cats dashboard

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

  it('Should detect user is logged in on init', () => {
    const authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    expect(authService.getLoggedInValue()).toBeTrue();
  });

  it('Should reset newCat after adding a cat', () => {  // The local newCat item should be reset after an add/edit
    const catService = TestBed.inject(CatService);
    spyOn(catService, 'addCat').and.callThrough();
    localStorage.setItem('userId', '123');

    component.newCat = {
      name: 'Simba',
      weight: '8',
      age: '5',
      breed: 'Persian'
    };

    component.addCat();

    expect(component.newCat).toEqual({ name: '', weight: '', age: '', breed: '' });
  });

  it('Should not delete cat if confirmation is canceled', () => { // Ensure that deleting is a two-step confirmation process
    spyOn(window, 'confirm').and.returnValue(false);
    const catService = TestBed.inject(CatService);
    spyOn(catService, 'deleteCat');

    const cat = { name: 'Luna', weight: 4, age: 2, breed: 'Ragdoll', _id: '321' };
    component.cats = [cat];

    component.deleteCat(cat, new MouseEvent('click'));

    expect(catService.deleteCat).not.toHaveBeenCalled();
  });

  it('Should start with no cats', () => {
    expect(component.cats).toEqual([]);
  });

  it('Should not load cats if userId is null', () => {
    const catService = TestBed.inject(CatService);
    spyOn(catService, 'getUserCats');

    localStorage.removeItem('userId');

    component.ngOnInit();

    expect(catService.getUserCats).not.toHaveBeenCalled();
  });

  it('Should initialize newCat with empty values', () => {
    expect(component.newCat).toEqual({ name: '', weight: '', age: '', breed: '' });
  });

  it('Should load selected cat into newCat when editCat is called', () => {
    const cat = { name: 'Kitty', weight: '4', age: '1', breed: 'Domestic', _id: 'xyz' };

    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'stopPropagation');

    component.cats = [cat];
    component.editCat(cat, mockEvent);

    expect(component.newCat).toEqual(cat);
  });

  it('Should update location of each cat on refresh', () => {
    const catService = TestBed.inject(CatService);
    spyOn(catService, 'updateCat').and.callThrough();
  
    localStorage.setItem('userId', 'user123');
    component.center = { lat: 29.65163, lng: -82.32483 }; // refreshLocations requires the general region of the map to be set
  
    component.cats = [
      { name: 'Whiskers', weight: '10 lbs', age: '2 years', breed: 'Siamese', _id: 'cat1' },
      { name: 'Poppers', weight: '20 lbs', age: '4 years', breed: 'Maine Coon', _id: 'cat2' }
    ];
  
    component.refreshLocations();
  
    expect(catService.updateCat).toHaveBeenCalledTimes(2);
    expect(catService.updateCat).toHaveBeenCalledWith('cat1', jasmine.objectContaining({ location: jasmine.any(Object) }));
    expect(catService.updateCat).toHaveBeenCalledWith('cat2', jasmine.objectContaining({ location: jasmine.any(Object) }));
  });

  it('Should load the "Refresh Locations" button when user is logged in', () => {
    const authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    authService.setLoggedIn(true);
  
    fixture.detectChanges();
  
    const button = fixture.debugElement.query(
      By.css('button[aria-label="Refresh Cat Locations"]')
    );
  
    expect(button).toBeTruthy();
  });
});
