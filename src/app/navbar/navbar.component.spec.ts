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

  it('Should have a "Cats" button that links to /cats', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/cats"]'));
    expect(link).toBeTruthy();
    expect(link.attributes['routerLink']).toBe('/cats');
  });

  it('Should update isLoggedIn when authService changes its value', () => {
    authService.setLoggedIn(false);
    fixture.detectChanges();
    expect(component.isLoggedIn).toBeFalse();

    authService.setLoggedIn(true);
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
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('Should contain a navbar element', () => {
    const navbar = fixture.debugElement.query(By.css('nav'));
    expect(navbar).toBeTruthy();
  });

  it('Should display "Logout" button only when logged in', () => {
    authService.setLoggedIn(true);
    fixture.detectChanges();
    const logoutButton = fixture.debugElement.query(By.css('button.logout'));
    expect(logoutButton).toBeTruthy();
  });

  it('Should not display "Logout" button when logged out', () => {
    authService.setLoggedIn(false);
    fixture.detectChanges();
    const logoutButton = fixture.debugElement.query(By.css('button.logout'));
    expect(logoutButton).toBeNull();
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
});
