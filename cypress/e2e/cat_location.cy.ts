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