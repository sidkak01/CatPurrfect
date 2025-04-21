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
