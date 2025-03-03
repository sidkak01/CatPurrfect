import { RegisterComponent } from '../../src/app/register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  beforeEach(() => {
    cy.mount(RegisterComponent, {
      imports: [FormsModule, HttpClientModule, RouterTestingModule]
    });
  });

  it('Should mount the component', () => {  // basic test for mounting the component
    cy.get('h2').should('contain.text', 'Register');
  });

  it('Should have all form fields', () => {     // ensuring all the form fields are expected
    cy.get('input[name="firstName"]').should('exist');
    cy.get('input[name="lastName"]').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="confirmPassword"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('Should allow filling out the form', () => {       // test filling out the form
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    
    cy.get('input[name="firstName"]').should('have.value', 'Test');
    cy.get('input[name="lastName"]').should('have.value', 'User');
    cy.get('input[name="username"]').should('have.value', 'testuser');
    cy.get('input[name="email"]').should('have.value', 'testuser@example.com');
    cy.get('input[name="password"]').should('have.value', 'password123');
    cy.get('input[name="confirmPassword"]').should('have.value', 'password123');
  });

  it('Should allow button to be clicked', () => {   // register button is clickable
    cy.window().then(win => {
      cy.spy(win, 'alert').as('alertSpy');
    });
    
    cy.get('button[type="submit"]').click();
    
    cy.get('@alertSpy').should('be.called');
  });
});