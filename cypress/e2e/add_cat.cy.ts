import '../support/commands';

describe('Cat Management', () => {
    beforeEach(() => {
        cy.login();
        cy.contains('h3', 'Add New Cat').should('be.visible');
      });
  
    it('Should add a new cat', () => {
      cy.contains('h3', 'Add New Cat').should('be.visible');
      
      cy.get('input[name="name"]').type('Whiskers');
      cy.get('input[name="weight"]').type('10 lbs');
      cy.get('input[name="age"]').type('3 years');
      cy.get('select[name="breed"]').select('Maine Coon');
      
      cy.contains('button', 'Add').click();
      
      cy.contains('.card-title', 'Whiskers').should('be.visible');
      cy.contains('.card-text', 'Breed: Maine Coon').should('be.visible');
      cy.contains('.card-text', 'Age: 3 years').should('be.visible');
      cy.contains('.card-text', 'Weight: 10 lbs').should('be.visible');
      
      cy.get('input[name="name"]').should('have.value', '');
      cy.get('input[name="weight"]').should('have.value', '');
      cy.get('input[name="age"]').should('have.value', '');
    });
  
    it('Should require a cat name', () => {
      cy.contains('button', 'Add').click();
      
      cy.get('.card-title').should('not.exist');
      
      cy.get('input[name="name"]').type('Mittens');
      cy.get('input[name="weight"]').type('20 lbs');
      cy.get('input[name="age"]').type('5 years');
      cy.get('select[name="breed"]').select('Maine Coon');
      cy.contains('button', 'Add').click();
      
      cy.contains('.card-title', 'Mittens').should('be.visible');
    });
  
    it('Should select a cat when clicked', () => {
      cy.get('input[name="name"]').type('Felix');
      cy.get('input[name="weight"]').type('15 lbs');
      cy.get('input[name="age"]').type('1 years');
      cy.get('select[name="breed"]').select('Maine Coon');
      cy.contains('button', 'Add').click();
      
      cy.contains('.card-title', 'Felix').click();
      
      cy.contains('.card-title', 'Felix')
        .parents('.card')
        .should('have.class', 'selected-cat');
      
    });
  });