import { CatsComponent } from '../../src/app/cats/cats.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('CatsComponent', () => {
  beforeEach(() => {
    cy.mount(CatsComponent, {
      imports: [FormsModule, CommonModule]
    });
  });

  it('Should mount the component', () => {
    cy.get('h3').should('contain.text', 'Add New Cat');
  });

  it('Should have a form with all required fields', () => {     // Make sure all the expected fields are present in the form
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="weight"]').should('exist');
    cy.get('input[name="age"]').should('exist');
    cy.get('select[name="breed"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('Should add a cat when form is submitted', () => {
    cy.get('.text-muted').should('contain.text', 'No cats added yet');
    
    // Fill out the form and then submit
    cy.get('input[name="name"]').type('Whiskers');
    cy.get('input[name="weight"]').type('10 lbs');
    cy.get('input[name="age"]').type('3');
    cy.get('select[name="breed"]').select('Siamese');
    
    cy.get('button[type="submit"]').click();
    
    // Check if the cat was added to the list with correct attributes
    cy.get('.card-title').should('contain.text', 'Whiskers');
    cy.get('.card-text').should('contain.text', 'Breed: Siamese');
    cy.get('.card-text').should('contain.text', 'Age: 3');
    cy.get('.card-text').should('contain.text', 'Weight: 10 lbs');
    
    cy.get('input[name="name"]').should('have.value', '');
  });
});