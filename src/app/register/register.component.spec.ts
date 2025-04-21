import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { RegisterComponent } from './register.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

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
    expect(component['authService'].setLoggedIn).toHaveBeenCalledWith(true);
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

  it('Should have the "/login" link on the "Register" button', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    expect(link).toBeTruthy();
    expect(link.attributes['routerLink']).toBe('/login');
  });

  it('Should initialize all form fields as empty strings', () => {
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

  it('Should call onRegister when submit button is clicked', () => {
    spyOn(component, 'onRegister');
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.triggerEventHandler('click', null);
    expect(component.onRegister).toHaveBeenCalled();
  });

  it('Should match snapshot of component HTML', () => {
    expect(fixture.nativeElement.innerHTML).toMatchSnapshot();
  });

  it('Should have a register button with text "Register"', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(button.textContent).toContain('Register');
  });
});
