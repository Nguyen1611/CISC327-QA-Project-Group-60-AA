describe('Booking Payment Functionality', () => {
  beforeEach(() => {
    // Visit the booking payment page with a specific flight ID
    cy.visit('http://localhost:5173/booking?id=6750a66c90910776ea2d74a9');
  });


  it('Should display an error message for invalid card details', () => {
    // Fill in invalid payment details
    cy.get('#email').type('testuser@example.com');
    cy.get('#phone').type('1234567890');
    cy.get('#cardholderName').type('John Doe');
    cy.get('#cardNumber').type('123'); // Invalid card number
    cy.get('#expirationDate').type('12/24');
    cy.get('#cvv').type('12'); // Invalid CVV

    // Attempt to confirm payment
    cy.get('[data-testid="confirm-payment-btn"]').click();

    // Verify error message is displayed
    cy.get('.error-message').should('contain', 'Invalid card number. It should be 16 digits.');
  });
});