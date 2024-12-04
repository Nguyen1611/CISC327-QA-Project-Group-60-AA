describe('Flight Search Functionality', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173'); // Adjust URL to match your app's URL
    });
  
    it('should filter flights based on search criteria', () => {
      cy.get('input[placeholder="Flight from?"]').type('Toronto');
      cy.get('input[placeholder="Where to?"]').type('Vancouver');
      cy.get('input[name="depart"]').type('2024-12-01');
      cy.get('input[name="return"]').type('2024-12-05');
      cy.get('button').contains('Search').click();
  
      cy.get('.flight-card').each(($card) => {
        cy.wrap($card).should('contain', 'Toronto');
        cy.wrap($card).should('contain', 'Vancouver');
      });
    });
  });
  