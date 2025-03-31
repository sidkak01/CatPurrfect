### GitHub link: https://github.com/sidkak01/CatPurrfect
### Video link: https://youtu.be/qnrAYGW5yOU

## Tasks Completed for Sprint 3
- Integration Tests for APIs in backend with frontend components
- Develop cats API in backend
- Update routes and create more user-friendly navigation pages
- Implement Google Maps API and adding cats location
- More unit and e2e tests for frontend and backend
- More coherent authentication that affects how frontend components are displayed on the web page

## Frontend:
### Tasks Accomplished
- Update navbar to remove "register" button and instead add it to login page
- Routes on login page such as "Register" and "Forgot Password?" properly work
- Cats page shows a walkthrough GIF if the user is a guest and not logged in
- If user is not logged in, they are unable to utilize the add cats page
- Authentication to check if user is logged in, and if so, the add cats page changes from the GIF to the allowed functionality
- Add Cats functionality is properly linked to backend so cats added are stored in MongoDB
- 'Your Cats' is now dynamic so user can select a cat and it is highlighted in the list
- Google Maps API is implemented so the map is now functional and interactive
- User can select a cat and click anywhere on the map to add the location of the cat
- Location badges added that when clicked, show the cat attributes
- If a user is logged in, there becomes a "Logout" button added to the navbar that properly logs out when clicked on
- Login component cyprus test and add cats/location e2e tests

### Login Component Cyprus Test:
```typescript
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
```
### Commands.ts with login() function for E2E testing:
```typescript
Cypress.Commands.add('login', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.contains('button', 'Login').click();
    cy.url().should('include', '/cats');
  });

  declare namespace Cypress {
    interface Chainable<Subject = any> {
      login(): Chainable<void>
    }
  }
```
### Add Cats Location E2E Test:
```typescript
import '../support/commands';

describe('Cat Location Management', () => {
    beforeEach(() => {
        cy.login();
      
      // Add a test cat
      cy.get('input[name="name"]').type('Tiger');
      cy.get('input[name="weight"]').type('12 lbs');
      cy.get('input[name="age"]').type('5 years');
      cy.get('select[name="breed"]').select('Bengal');
      cy.contains('button', 'Add').click();
    });
  
    it('Should add a location to a cat', () => {
      cy.contains('.card-title', 'Tiger').click();
      
      cy.get('google-map')
        .should('be.visible')
        .then(($map) => {
            const rect = $map[0].getBoundingClientRect();
    
            cy.get('body').click(rect.left + 500, rect.top + 200);

            cy.wait(500);
        
        cy.contains('.location-badge', 'Location Added')
          .should('be.visible')
          .should('exist');
        });
    });

    it('Should persist the location after deselecting and selecting again', () => {
        cy.contains('.card-title', 'Tiger').click();
        
        cy.get('google-map')
          .should('be.visible')
          .then(($map) => {
            const rect = $map[0].getBoundingClientRect();
            cy.get('body').click(rect.left + 500, rect.top + 200);
          });
        
        cy.contains('.location-badge', 'Location Added').should('be.visible');
        
        // Deselect the cat by clicking outside the map
        cy.get('h3').first().click();
        
        cy.contains('.card-title', 'Tiger').click();
        
        cy.contains('.location-badge', 'Location Added').should('be.visible');
      });
      
      it('Should display marker on the map after adding location', () => {
        cy.contains('.card-title', 'Tiger').click();
        
        cy.get('google-map')
          .should('be.visible')
          .then(($map) => {
            const rect = $map[0].getBoundingClientRect();
            cy.get('body').click(rect.left + 500, rect.top + 200);
          });
        
        cy.contains('.location-badge', 'Location Added').should('be.visible');
        
        cy.get('google-map').should('be.visible');
      });
    
   });
```

## Backend:
### Tasks Accomplished
- Developed Cat Management System APIs
- Add Cat API
- Delete Cat API
- Get All Cats API
- Get Cat by ID API
- Update Cat API
- Implemented Admin Authentication API
- Executed DB Tests
- Executed Unit Tests for AddCat API
- Executed Unit Tests for GetAllCats API

# Sprint 3 Backend API Documentation

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
