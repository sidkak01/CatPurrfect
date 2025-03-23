import { LoginComponent } from '../../src/app/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

// Mock component for the cats route
@Component({ template: '<div>Cats Component</div>' })
class MockCatsComponent {}

describe('LoginComponent', () => {
  beforeEach(() => {
    // Login success navigates to cats page so create a mock route
    const routes = [
      { path: 'cats', component: MockCatsComponent }
    ];

    cy.mount(LoginComponent, {
      imports: [
        FormsModule, 
        HttpClientModule, 
        RouterTestingModule.withRoutes(routes)
      ]
    });

    cy.window().then(win => {
      cy.stub(win, 'alert').as('alertSpy');
      cy.stub(win.console, 'log').as('consoleLog');
    });
  });

  it('Should mount the component', () => {
    cy.get('h2').should('contain.text', 'Login');
  });

  it('Should have all form fields', () => {
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('Should allow filling out the form', () => {
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    
    cy.get('input[name="email"]').should('have.value', 'testuser@example.com');
    cy.get('input[name="password"]').should('have.value', 'password123');
  });

  it('Should have navigation links', () => {
    cy.get('a[routerLink="/login"]').should('contain.text', 'Click Here to Reset');
    cy.get('a[routerLink="/register"]').should('contain.text', 'Register');
  });

  it('Should handle login button click', () => {
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('password123');
    
    cy.get('button[type="submit"]').click();
    
    cy.get('@alertSpy').should('be.calledWith', 'Login Successful!');
    cy.get('@consoleLog').should('be.called');
  });
});