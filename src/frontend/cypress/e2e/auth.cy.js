describe('Auth Features - SignIn and Register', () => {
    const frontendUrl = 'http://localhost:5173';
    const backendUrl = 'http://127.0.0.1:5000';
  
    beforeEach(() => {
      // Visit the frontend application
      cy.visit(frontendUrl);
    });
  
    it('renders SignIn component correctly', () => {
      // Navigate to SignIn page
      cy.contains('Sign In').click();
  
      // Verify SignIn form elements
      cy.get('input[placeholder="Email"]').should('exist');
      cy.get('input[placeholder="Password"]').should('exist');
      cy.get('button.btn-submit').should('exist');
    });
  
    it('shows error for invalid SignIn credentials', () => {
      // Navigate to SignIn page
      cy.contains('Sign In').click();
  
      // Fill in the form with invalid credentials
      cy.get('input[placeholder="Email"]').type('wronguser@example.com');
      cy.get('input[placeholder="Password"]').type('wrongpassword');
      cy.get('button.btn-submit').click();
  
      // Mock API response for failed login
      cy.intercept('POST', `${backendUrl}/auth/login`, {
        statusCode: 401,
        body: { status: 'failure', message: 'Invalid credentials.' },
      });
  
      // Verify error message
      cy.contains('Invalid credentials.').should('be.visible');
    });
  
    it('renders Register component correctly', () => {
      // Navigate to Register page
      cy.contains('Register').click();
  
      // Verify Register form elements
      cy.get('input[placeholder="Email"]').should('exist');
      cy.get('input[placeholder="Password"]').should('exist');
      cy.get('input[placeholder="Confirm Password"]').should('exist');
      cy.get('button.btn-submit').should('exist');
    });
  
    it('handles valid registration successfully', () => {
        const newUserEmail = 'newwwwuser@example.com';
    
        // Navigate to Register page
        cy.contains('Register').click();
    
        // Fill in the form with valid registration details
        cy.get('input[placeholder="Email"]').type(newUserEmail);
        cy.get('input[placeholder="Password"]').type('password123');
        cy.get('input[placeholder="Confirm Password"]').type('password123');
        cy.get('button.btn-submit').click();
    
        // Mock API response for successful registration
        cy.intercept('POST', `${backendUrl}/auth/register`, {
          statusCode: 200,
          body: { status: 'success' },
        }).as('registerRequest');
    
        // Verify success message
        cy.contains('Registration successful!').should('be.visible');
    
        // Cleanup: Delete the newly created user
        cy.request('DELETE', `${backendUrl}/auth/delete`, { email: newUserEmail }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq('User deleted successfully.');
        });
    });
  
    it('shows error for mismatched passwords during registration', () => {
      // Navigate to Register page
      cy.contains('Register').click();
  
      // Fill in the form with mismatched passwords
      cy.get('input[placeholder="Email"]').type('newwwuser@example.com');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('input[placeholder="Confirm Password"]').type('differentpassword');
      cy.get('button.btn-submit').click();
  
      // Verify error message
      cy.contains('Passwords do not match.').should('be.visible');
    });
  
    it('shows error for invalid email during registration', () => {
      // Navigate to Register page
      cy.contains('Register').click();
  
      // Fill in the form with an invalid email
      cy.get('input[placeholder="Email"]').type('invalidemail');
      cy.get('input[placeholder="Password"]').type('password123');
      cy.get('input[placeholder="Confirm Password"]').type('password123');
      cy.get('button.btn-submit').click();
  
      // Verify error message
      cy.contains('Invalid email format.').should('be.visible');
    });
  });
  