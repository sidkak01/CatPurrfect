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
    spyOn(router, 'navigate');  // Creating a spy for routing on login attempts
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  // Basic successful login attempt
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
    expect(router.navigate).toHaveBeenCalledWith(['/cats']);    // Navigate to cats page with loggedIn flag set

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
        error: { message: 'Invalid email or password' }   // Mock the expected error when invalid credentials are used
      }))
    );

    component.email = 'wrong@example.com';
    component.password = 'wrongpassword';

    component.onLogin();

    expect(window.alert).toHaveBeenCalledWith('Login failed: Invalid email or password');   // The on-screen window that is shown to the user
    expect(component['authService'].setLoggedIn).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  // Making sure the link is present versus setting up full navigation routing
  it('Should have the "/register" link on the "Register" button', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/register"]')); // Find the element on the page that routes to the register page
    expect(link).toBeTruthy();
    expect(link.attributes['routerLink']).toBe('/register');  // Ensure the navigation link to be present
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
  
    expect(window.alert).toHaveBeenCalledWith('Login failed: Invalid email or password');   // Frontend feedback to the user
  });

});
