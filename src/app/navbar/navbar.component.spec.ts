import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../services/auth.service';
import { of, BehaviorSubject } from 'rxjs';
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
});