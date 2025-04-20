import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { LoginComponent } from './login.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
