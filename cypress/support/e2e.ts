export function loginUser() {
    cy.window().then((win) => {
      win.localStorage.setItem('isLoggedIn', 'true');
    });
  }
  
  export function mockAuthService() {
    cy.window().then((win) => {
      (win as any).AuthService = {
        getLoggedInValue: () => true,
        isLoggedIn: () => ({ subscribe: (callback: any) => callback(true) })
      };
    });
  }
  
  export function interceptCatRequests() {
    cy.intercept('POST', '/api/cats', {
      statusCode: 201,
      body: { id: 'fake-id', name: 'Intercepted Cat' }
    }).as('createCat');
    
    cy.intercept('GET', '/api/cats', {
      statusCode: 200,
      body: []
    }).as('getCats');
  }