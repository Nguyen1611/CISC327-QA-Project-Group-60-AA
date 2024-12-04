describe('Flight Booking Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should navigate to the booking page when clicking "Book"', () => {
    // Select "One Way" trip type
     // Ensure the radio button is checked

    // Input search criteria
    cy.get('input[placeholder="Flight from?"]').type('Toronto');
    cy.get('input[placeholder="Where to?"]').type('Vancouver');
    cy.get('button').contains('Search').click();

    // Verify the flight cards are displayed
    cy.get('.flight-card').first().should('exist');

    // Click the "Book" button on the first flight card
    cy.get('.flight-card').first().find('button').contains('Book').click();

    // Verify navigation to the booking page
    cy.url().should('include', '/booking?id=');
  });
});