describe('Trip Type Selection', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173');
    });
    it('should display only round trip flights when "Round Trip" is selected', () => {
      cy.get('.flight-card').each(($card) => {
        cy.wrap($card).should('contain', 'Round Trip');
      });
    });
  });
  