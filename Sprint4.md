### GitHub link: https://github.com/sidkak01/CatPurrfect
### Video link: https://youtu.be/RmfRDdz9pJg

## Tasks Completed for Sprint 4
- Add live location tracking for cats
- Finish cats and user API in backend
- Update routes and create more user-friendly navigation pages
- Implement Edit/Delete button for each cat in dashboard
- Persistence so the personal cat dashboard remains for user if they logout or refresh the page
- Thorough unit testing
- Store the cats in the backend based on userId (update DB schema)
- Complete run-through demo of the project!

## Frontend:
### Tasks Accomplished
- Create an edit button to edit an existing cat
- Create a delete button to remove an existing cat
- Link both edit/delete buttons with backend Cats API to properly function as intended
- Add a "Refresh Locations" button to simulate live location tracking for cats
- Link the "Refresh Locations" button with backend to update the cats' location attribute in the DB
- Implement persistence to the app to maintain content if a user logs out or refreshes the page
- Linked any new added cats with the 'userId' of a user to maintain DB organization with users and cats table
- Updated home page elements
- Added 55 unit tests for thorough testing of the frontend, mocking components and services as necessary

### Frontend Unit Tests

<details> <summary>Click to show/hide Frontend Unit Tests</summary>

### Navbar Component Unit Tests:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
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

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: () => null
    }
  };
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NavbarComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should have a "Cats" button that links to /cats', () => {   // Ensure the cats button links to the cats page
    const link = fixture.debugElement.query(By.css('a[routerLink="/cats"]'));
    expect(link).toBeTruthy();
    expect(link.attributes['routerLink']).toBe('/cats');
  });

  it('Should update isLoggedIn when authService changes its value', () => {
    authService.setLoggedIn(false); // Logged out state
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeFalse();

    authService.setLoggedIn(true);  // Mock user logging in successfully
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('Should log the user out and navigate to home', () => {
    spyOn(localStorage, 'removeItem');
    spyOn(authService, 'setLoggedIn');

    component.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(authService.setLoggedIn).toHaveBeenCalledWith(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);  // Logging out workflow removes localStorage items and ends with navigating to home
  });

  it('Should contain a navbar element', () => { // Ensure navbar remains on the screen
    const navbar = fixture.debugElement.query(By.css('nav'));
    expect(navbar).toBeTruthy();
  });

  it('Should display "Logout" link only when logged in', () => {  // Conditional check based on login status
    authService.setLoggedIn(true);
    fixture.detectChanges();
  
    const logoutLink = fixture.debugElement.queryAll(By.css('a.nav-link'))
      .find(el => el.nativeElement.textContent.includes('Logout')); // Not using an actual button, but an <a> element
  
    expect(logoutLink).toBeTruthy();
  });

  it('Should not display "Logout" link when logged out', () => {
    authService.setLoggedIn(false);
    fixture.detectChanges();
  
    const logoutLink = fixture.debugElement.queryAll(By.css('a.nav-link'))
      .find(el => el.nativeElement.textContent.includes('Logout'));
  
    expect(logoutLink).toBeUndefined();
  });

  it('Should have a home button that links to /', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/"]'));
    expect(link).toBeTruthy();
    expect(link.attributes['routerLink']).toBe('/');
  });

  it('Should display "Login" link when logged out', () => {
    authService.setLoggedIn(false);
    fixture.detectChanges();
    const loginLink = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    expect(loginLink).toBeTruthy();
  });

  it('Should not display "Login" link when logged in', () => {
    authService.setLoggedIn(true);
    fixture.detectChanges();
    const loginLink = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    expect(loginLink).toBeNull();
  });

  it('Should have a logout link with text "Logout" when logged in', () => { // Checking the actual frontend text
    authService.setLoggedIn(true);
    fixture.detectChanges();
  
    const logoutLink = fixture.debugElement.queryAll(By.css('a.nav-link'))
      .find(el => el.nativeElement.textContent.includes('Logout'));
  
    expect(logoutLink).toBeTruthy();
    expect(logoutLink!.nativeElement.textContent).toContain('Logout');
  });
});
```
### Register Component Unit Tests:
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { RegisterComponent } from './register.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

class MockUserService { // Mock the register functionality in the UserService with a spy
  register = jasmine.createSpy('register').and.returnValue(of({
    user: { id: '456', name: 'New User' },
    token: 'fake-token'
  }));
}

class MockAuthService { // Mocking the setLoggedIn state to manipulate as the page is conditional based on this value
  setLoggedIn = jasmine.createSpy('setLoggedIn');
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: () => null
    }
  };
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,  // Not used but include for all unit testing components
        RouterTestingModule,
        RegisterComponent
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should show alert if passwords do not match and not call register', () => {
    spyOn(window, 'alert');
    component.password = '12345';
    component.confirmPassword = '1234567';

    component.onRegister();

    expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
    expect(component['userService'].register).not.toHaveBeenCalled();
  });

  it('Should reset the form fields when resetForm is called', () => {
    component.firstName = 'Sprint';
    component.lastName = 'Test';
    component.username = 'sprinttest';
    component.email = 'sprinttest@example.com';
    component.password = 'pass123';
    component.confirmPassword = 'pass123';

    component.resetForm();

    expect(component.firstName).toBe('');
    expect(component.lastName).toBe('');
    expect(component.username).toBe('');
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.confirmPassword).toBe('');
  });

  it('Should call register and navigate on successful registration', () => {
    spyOn(window, 'alert');

    component.firstName = 'Test';
    component.lastName = 'User';
    component.username = 'test1';
    component.email = 'test1@example.com';
    component.password = '123456';
    component.confirmPassword = '123456';

    component.onRegister();

    expect(component['userService'].register).toHaveBeenCalledWith({
      firstName: 'Test',
      lastName: 'User',
      username: 'test1',
      email: 'test1@example.com',
      password: '123456'
    });

    expect(component['authService'].setLoggedIn).toHaveBeenCalledWith(true);  // Upon registration mock the AuthService being called
    expect(window.alert).toHaveBeenCalledWith('Registration Successful!');
  });

  it('Should show alert on registration failure (user already exists)', () => {
    spyOn(window, 'alert');

    const userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    userService.register.and.returnValue(
      throwError(() => ({
        error: { message: 'User already exists' }
      }))
    );

    component.firstName = 'Test';
    component.lastName = 'User';
    component.username = 'test1';
    component.email = 'test1@example.com';
    component.password = '123456';
    component.confirmPassword = '123456';

    component.onRegister();

    expect(window.alert).toHaveBeenCalledWith('Registration failed: User already exists');
  });

  // Making sure the link is present versus setting up full navigation routing - similar to login component test
  it('Should have the "/login" link on the "Register" button', () => {
    // Find the element on the page that routes to the login page
    const link = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    expect(link).toBeTruthy();
    expect(link.attributes['routerLink']).toBe('/login');  // Ensure the navigation link to be present
  });

  it('Should initialize all form fields as empty strings', () => {  // Nothing should be in the forms to begin
    expect(component.firstName).toBe('');
    expect(component.lastName).toBe('');
    expect(component.username).toBe('');
    expect(component.email).toBe('');
    expect(component.password).toBe('');
    expect(component.confirmPassword).toBe('');
  });

  it('Should contain a form element in the template', () => {
    const form = fixture.debugElement.query(By.css('form'));
    expect(form).toBeTruthy();
  });

  it('Should contain input fields for first name, last name, username, email, password and confirmPassword', () => {
    const inputs = [
      'input[name="firstName"]',
      'input[name="lastName"]',
      'input[name="username"]',
      'input[name="email"]',
      'input[name="password"]',
      'input[name="confirmPassword"]'
    ];
    inputs.forEach(selector => {
      const input = fixture.debugElement.query(By.css(selector));
      expect(input).toBeTruthy();
    });
  });

  it('Should call onRegister when form is submitted', () => {
    spyOn(component, 'onRegister');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    expect(component.onRegister).toHaveBeenCalled();
  });

  it('Should have a register button with text "Register"', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(button.textContent).toContain('Register');
  });
});
```
### Login Component Unit Tests:
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';

class MockUserService {
  login = jasmine.createSpy('login').and.returnValue(of({
    user: { id: '123', name: 'Test User' },
    token: 'fake-token'
  }));
}

class MockAuthService {
  setLoggedIn = jasmine.createSpy('setLoggedIn');
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: () => null
    }
  };
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        LoginComponent
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should call login and navigate on successful login', () => {
    spyOn(window, 'alert');

    component.email = 'test@example.com';
    component.password = 'password123';

    component.onLogin();

    expect(component['userService'].login).toHaveBeenCalledWith({   // Mock the successfull login attempt
      email: 'test@example.com',
      password: 'password123'
    });

    expect(window.alert).toHaveBeenCalledWith('Login Successful!');
    expect(component['authService'].setLoggedIn).toHaveBeenCalledWith(true);
    expect(router.navigate).toHaveBeenCalledWith(['/cats']);  // Navigate to cats page with loggedIn flag set

    // Check localStorage items
    expect(localStorage.getItem('userId')).toBe('123');
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('user')).toContain('Test User');
  });

  // Logging in with credentials not yet registered
  it('Should show alert on failed login', () => {
    spyOn(window, 'alert');

    const userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    userService.login.and.returnValue(
      throwError(() => ({
        error: { message: 'Invalid email or password' } // Mock the expected error when invalid credentials are used
      }))
    );

    component.email = 'wrong@example.com';
    component.password = 'wrongpassword';

    component.onLogin();

    expect(window.alert).toHaveBeenCalledWith('Login failed: Invalid email or password'); // The on-screen window that is shown to the user
    expect(component['authService'].setLoggedIn).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  // Making sure the link is present versus setting up full navigation routing
  it('Should have the "/register" link on the "Register" button', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/register"]'));
    expect(link).toBeTruthy();
    expect(link.attributes['routerLink']).toBe('/register');
  });

  it('Should display "Register" link text', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/register"]')).nativeElement;
    expect(link.textContent).toContain('Register');
  });

  // Attempting a login with the password field empty
  it('Should show alert if user tries logging in with password field empty', () => {
    spyOn(window, 'alert');

    const userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    
    // Simulate backend returning a 401 error
    userService.login.and.returnValue(
      throwError(() => ({
        error: { message: 'Invalid email or password' }
      }))
    );

    component.email = 'test@example.com';
    component.password = '';

    component.onLogin();

    expect(window.alert).toHaveBeenCalledWith('Login failed: Invalid email or password'); // Frontend feedback to the user
  });

  it('Should initialize email and password as empty strings', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });

  // Basic frontend rendering tests
  it('Should contain a login form in the template', () => {
    const form = fixture.debugElement.query(By.css('form'));
    expect(form).toBeTruthy();
  });

  it('Should have an email input field', () => {
    const emailInput = fixture.debugElement.query(By.css('input[type="email"]'));
    expect(emailInput).toBeTruthy();
  });

  it('Should have a password input field', () => {
    const passwordInput = fixture.debugElement.query(By.css('input[type="password"]'));
    expect(passwordInput).toBeTruthy();
  });

  it('Should have a login button with text "Login"', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(button.textContent).toContain('Login');
  });

  it('Should call onLogin when login form is submitted', () => {
    spyOn(component, 'onLogin');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);
    expect(component.onLogin).toHaveBeenCalled();
  });
});
```
### Cats Component Unit Tests:

```typescript
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
```

### Home Component Unit Tests:
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should render the CatPurrfect logo with correct text', () => {
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.attributes['src']).toContain('assets/CatPurrfect.png');
    expect(img.attributes['alt']).toBe('CatPurrfect Logo');
  });

  it('Should display the correct intro text', () => {
    const paragraph = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(paragraph.textContent).toContain('The purrfect place to keep track of your feline friends!');
  });

  it('Should display the hero section message', () => {
    const paragraph = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(paragraph.textContent).toContain('The purrfect place to keep track of your feline friends!');
  });

  it('Should contain the hero section div', () => {
    const hero = fixture.debugElement.query(By.css('.hero-section'));
    expect(hero).toBeTruthy();
  });

  it('Should render exactly one image (logo)', () => {
    const imgs = fixture.debugElement.queryAll(By.css('img'));
    expect(imgs.length).toBe(1);
  });

  it('Should render exactly one paragraph', () => {
    const paragraphs = fixture.debugElement.queryAll(By.css('p'));
    expect(paragraphs.length).toBe(1);
  });

});
```
</details>

## Backend:
### Tasks Accomplished
- Finish Cat Management System APIs
- Update Cat API
- Executed DB Tests
- Executed Unit Tests for AddCat API
- Executed Unit Tests for GetAllCats API

# Sprint 4 Backend API Documentation

## MongoDB Schema
```typescript
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, default: 'user' }
  }, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Cat Schema
const catSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: mongoose.Schema.Types.Mixed },
  age: { type: mongoose.Schema.Types.Mixed },
  breed: { type: String },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
}, { timestamps: true });

const Cat = mongoose.model('Cat', catSchema);
```

## Full API Endpoints

## **User Authentication API**

### **1. Register User**
**Endpoint:** `/user`  
**Method:** `POST`  
**Description:** Registers a new user and hashes their password.  

#### **Request Body:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "username": "testuser",
  "email": "sidnigade@gmail.com",
  "password": "password123",
  "role": "user"
}
```

#### **Response:**
**Success (201 Created)**
```json
{
  "message": "User registered successfully"
}
```

**Error (400 Bad Request - Missing Fields)**
```json
{
  "error": "First Name, Last Name, Email, username, and password are required"
}
```

**Error (409 Conflict - Email Already Exists)**
```json
{
  "error": "Email already in use"
}
```

---

### **2. Login User**
**Endpoint:** `/login`  
**Method:** `POST`  
**Description:** Authenticates a user and returns a token.  

#### **Request Body:**
```json
{
  "email": "sidnigade@gmail.com",
  "password": "password123"
}
```

#### **Response:**
**Success (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1..."
}
```

**Error (403 Forbidden - Wrong credentials)**
```json
{
  "error": "Invalid credentials"
}
```

**Error (400 Bad Request - Missing Fields)**
```json
{
  "error": "Email and password are required"
}
```

---

### **3. Get All Users**
**Endpoint:** `/users`  
**Method:** `GET`  
**Description:** Retrieves a list of all users.

#### **Response:**
**Success (200 OK)**
```json
[
  {
    "_id": "123456789",
    "username": "testuser",
    "email": "sidnigade@gmail.com",
    "role": "user"
  }
]
```

---

### **4. Get User Count**
**Endpoint:** `/users/count`  
**Method:** `GET`  
**Description:** Retrieves the total count of users in the database.

#### **Response:**
**Success (200 OK)**
```json
{
  "count": 1
}
```

---

### **5. Get User by ID**
**Endpoint:** `/user/:id`  
**Method:** `GET`  
**Description:** Retrieves user details by user ID.

#### **Response:**
**Success (200 OK)**
```json
{
  "_id": "123456789",
  "username": "testuser",
  "email": "sidnigade@gmail.com",
  "role": "user"
}
```

**Error (404 Not Found)**
```json
{
  "error": "User not found"
}
```

---

### **6. Update User**
**Endpoint:** `/user/:id`  
**Method:** `PUT`  
**Description:** Updates user information by user ID.

#### **Request Body:**
```json
{
  "username": "updateduser",
  "role": "admin"
}
```

#### **Response:**
**Success (200 OK)**
```json
{
  "message": "User updated successfully"
}
```

**Error (404 Not Found)**
```json
{
  "error": "User not found"
}
```

---

### **7. Delete User**
**Endpoint:** `/user/:id`  
**Method:** `DELETE`  
**Description:** Deletes a user by ID.

#### **Response:**
**Success (200 OK)**
```json
{
  "message": "User account deleted successfully"
}
```

**Error (404 Not Found)**
```json
{
  "error": "User not found"
}
```

---

## **Cat Management API**

### **1. Add Cat**
**Endpoint:** /cat  
**Method:** POST  
**Description:** Adds a new cat to the system.  

#### **Request Body:**
json
{
  "name": "Whiskers",
  "age": 2,
  "breed": "abcd",
  "owner": "sid kak"
}

#### **Response:**
**Success (201 Created)**
json
{
  "message": "Cat added successfully"
}

**Error (400 Bad Request - Missing Fields)**
json
{
  "error": "Name, age, and breed are required"
}

---

### **2. Delete Cat**
**Endpoint:** /cat/:id  
**Method:** DELETE  
**Description:** Deletes a cat by its ID.  

#### **Response:**
**Success (200 OK)**
json
{
  "message": "Cat deleted successfully"
}

**Error (404 Not Found)**
json
{
  "error": "Cat not found"
}

---

### **3. Get All Cats**
**Endpoint:** /cats  
**Method:** GET  
**Description:** Retrieves a list of all cats.

#### **Response:**
**Success (200 OK)**
json
[
  {
    "_id": "987654321",
    "name": "Whiskers",
    "age": 2,
    "breed": "abcd",
    "owner": "sid kak"
  }
]

---

### **4. Get Cat by ID**
**Endpoint:** /cat/:id  
**Method:** GET  
**Description:** Retrieves details of a cat by ID.

#### **Response:**
**Success (200 OK)**
json
{
  "_id": "987654321",
  "name": "Whiskers",
  "age": 2,
  "breed": "abcd",
  "owner": "sid kak"
}

**Error (404 Not Found)**
json
{
  "error": "Cat not found"
}

---

### **5. Update Cat**
**Endpoint:** /cat/:id  
**Method:** PUT  
**Description:** Updates cat information by ID.

#### **Request Body:**
json
{
  "name": "Mittens",
  "age": 3
}

#### **Response:**
**Success (200 OK)**
json
{
  "message": "Cat updated successfully"
}

**Error (404 Not Found)**
json
{
  "error": "Cat not found"
}

---

### **6. Admin Authentication**
**Endpoint:** /admin/login  
**Method:** POST  
**Description:** Authenticates an admin and returns a token.  

#### **Request Body:**
json
{
  "email": "sid@abcd.com",
  "password": "adminpass"
}

#### **Response:**
**Success (200 OK)**
json
{
  "token": "eyJhbGciOiJIUzI1..."
}

**Error (403 Forbidden - Wrong credentials)**
json
{
  "error": "Invalid credentials"
}

**Error (400 Bad Request - Missing Fields)**
json
{
  "error": "Email and password are required"
}

---

#### Run Tests:
navigate to the test folder  
npm install --save-dev jest supertest  
npm test  
