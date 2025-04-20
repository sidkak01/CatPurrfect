import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { RegisterComponent } from './register.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

class MockUserService {
  register = jasmine.createSpy('register').and.returnValue(of({
    user: { id: '456', name: 'New User' },
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

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
