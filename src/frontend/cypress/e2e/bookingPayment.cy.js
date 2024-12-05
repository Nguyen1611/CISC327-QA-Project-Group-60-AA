describe('Booking Payment Functionality', () => {
    beforeEach(() => {
      // Set up the server and mock backend responses
      cy.intercept('GET', 'http://127.0.0.1:5000/get-flight/*', {
        statusCode: 200,
        body: {
          flight: {
            _id: '6726f4075edf20eb09d8f39a',
            fromLocation: 'Toronto',
            toLocation: 'Montreal',
            price: 79,
            img: 'toronto-montreal.jpg',
            tripType: 'One Way',
            date: '2024-12-01',
            availableSeats: [
              { seat: '1A', available: true },
              { seat: '1B', available: false }
            ]
          }
        },
      }).as('getFlight');
  
      cy.intercept('POST', 'http://127.0.0.1:5000/confirmBooking', {
        statusCode: 200,
        body: {
          message: 'Booking confirmed successfully!',
          flight_code: 'TO-MO-20241201083000',
        },
      }).as('confirmBooking');
    });
  
    it('Should display flight details and allow successful booking', () => {
      // Visit the booking payment page with flight ID
      cy.visit('http://localhost:5173/booking-payment?id=6726f4075edf20eb09d8f39a');
  
      // Wait for the flight details to load
      cy.wait('@getFlight');
  
      // Assert flight details are displayed
      cy.get('.flight-route').should('contain', 'Toronto → Montreal');
      cy.get('.flight-time').should('contain', '2024-12-01');
      cy.get('.summary-line.total').should('contain', '$179'); // Flight price + Taxes & Fees
  
      // Fill in payment and contact details
      cy.get('#email').type('testuser@example.com');
      cy.get('#phone').type('1234567890');
      cy.get('#cardholderName').type('John Doe');
      cy.get('#cardNumber').type('1234567812345678');
      cy.get('#expirationDate').type('12/24');
      cy.get('#cvv').type('123');
  
      // Click on confirm payment
      cy.get('[data-testid="confirm-payment-btn"]').click();
  
      // Wait for the confirmBooking API call
      cy.wait('@confirmBooking');
  
      // Assert the user is navigated to the PaymentSuccessfully page
      cy.url().should('include', '/payment-successfully');
      cy.get('.success-message').should('contain', 'Payment Successful!');
      cy.get('.flight-route').should('contain', 'Toronto → Montreal');
      cy.get('.total-price').should('contain', '$179');
    });
  
    it('Should display an error for invalid card details', () => {
      // Visit the booking payment page
      cy.visit('http://localhost:5173/booking-payment?id=6726f4075edf20eb09d8f39a');
  
      // Wait for the flight details to load
      cy.wait('@getFlight');
  
      // Fill in incorrect payment details
      cy.get('#email').type('testuser@example.com');
      cy.get('#phone').type('1234567890');
      cy.get('#cardholderName').type('John Doe');
      cy.get('#cardNumber').type('123'); // Invalid card number
      cy.get('#expirationDate').type('12/24');
      cy.get('#cvv').type('12'); // Invalid CVV
  
      // Click on confirm payment
      cy.get('[data-testid="confirm-payment-btn"]').click();
  
      // Assert error message is displayed
      cy.get('.error-message').should('contain', 'Invalid card number. It should be 16 digits.');
    });
  });
  
