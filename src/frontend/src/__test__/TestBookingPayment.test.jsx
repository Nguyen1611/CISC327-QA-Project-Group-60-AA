import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom'; // Import Routes and Route
import BookingPayment from '../pages/BookingPayment'; // Path to your component
import PaymentFailed from '../pages/PaymentFailed'; // Import PaymentFailed component
import PaymentSuccessfully from '../pages/PaymentSuccessfully'; // Import PaymentFailed component
import '@testing-library/jest-dom';


describe('BookingPayment Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/booking-payment']}>
        <Routes>
          <Route path="/booking-payment" element={<BookingPayment />} />
        </Routes>
      </MemoryRouter>
    );
  });

  
  test('renders the component correctly', () => {
    expect(screen.getByText(/review & secure payment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiration date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm payment/i)).toBeInTheDocument();
  });

  test('displays flight information correctly', () => {
    // Update with expected flight details
    expect(screen.getByText(/toronto → montreal/i)).toBeInTheDocument(); // Check for flight route
    expect(screen.getByText(/2024-12-01/i)).toBeInTheDocument(); // Check for date
    expect(screen.getByText(/one way/i)).toBeInTheDocument(); // Check for trip type

    // Check for available seats display
    expect(screen.getByText(/1a \(available\)/i)).toBeInTheDocument();
    expect(screen.getByText(/1b \(booked\)/i)).toBeInTheDocument();
  });

  test('displays price summary in booking confirmation', () => {
    // Verify the price summary
    expect(screen.getByText(/price summary/i)).toBeInTheDocument();
    expect(screen.getByText(/flight price/i)).toBeInTheDocument();
    expect(screen.getByText(/\$79/i)).toBeInTheDocument(); // Flight price
    expect(screen.getByText(/taxes & fees/i)).toBeInTheDocument();
    expect(screen.getByText(/\$100/i)).toBeInTheDocument(); // Taxes & fees
    expect(screen.getByText(/total/i)).toBeInTheDocument();
    expect(screen.getByText(/\$179/i)).toBeInTheDocument(); // Total price
  });

  test('fetches flight details based on flight ID', async () => {
    const flightDetails = await screen.findByText(/toronto → montreal/i); // Check if flight details are fetched
    expect(flightDetails).toBeInTheDocument();
  });

  // Test case to cover lines 58-76 (flight details rendering)
  test('displays flight details like date, trip type, and available seats', () => {
    expect(screen.getByText(/2024-12-01/i)).toBeInTheDocument(); // Date
    expect(screen.getByText(/one way/i)).toBeInTheDocument(); // Trip type
    expect(screen.getByText(/1a \(available\)/i)).toBeInTheDocument(); // Available seat 1A
    expect(screen.getByText(/1b \(booked\)/i)).toBeInTheDocument(); // Booked seat 1B
  });

  // Test case to cover lines 80-136 (form rendering and payment inputs)
  test('displays the correct payment form fields', () => {
    expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/expiration date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  // Test case to cover lines 58-76 (flight details rendering)
  test('displays flight details like date, trip type, and available seats', () => {
    expect(screen.getByText(/toronto → montreal/i)).toBeInTheDocument(); // Flight route
    expect(screen.getByText(/2024-12-01/i)).toBeInTheDocument(); // Date
    expect(screen.getByText(/one way/i)).toBeInTheDocument(); // Trip type
    expect(screen.getByText(/1a \(available\)/i)).toBeInTheDocument(); // Available seat 1A
    expect(screen.getByText(/1b \(booked\)/i)).toBeInTheDocument(); // Booked seat 1B
  });

  

  test('navigates to PaymentSuccessfully page after successful payment', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Payment confirmed!' })
      })
    );
  
    // Fill in payment form
    fireEvent.change(screen.getByLabelText(/cardholder name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '1234567890123456' } });
    fireEvent.change(screen.getByLabelText(/expiration date/i), { target: { value: '12/24' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
  
    // Wait for "review & secure payment" text to appear
    const reviewText = await screen.findByText(/review & secure payment/i);
  
    // Check for the button directly in the document
    const confirmButton = screen.getByRole('button', { name: /confirm payment/i });
  
    // If the button is not found, log it for debugging
    console.log(confirmButton);
  
    fireEvent.click(confirmButton);
  
    // Wait for PaymentSuccessfully page to load
    await waitFor(() => {
      expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
    });
  });




  test('displays error message on failed booking confirmation', async () => {
    // Mock fetch to return a failed response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Failed to confirm booking' })
      })
    );
  
    // Fill in payment form (only necessary if input is required before submission)
    fireEvent.change(screen.getByLabelText(/cardholder name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '1234567890123456' } });
    fireEvent.change(screen.getByLabelText(/expiration date/i), { target: { value: '12/24' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
  
    // Trigger the payment submission
    fireEvent.click(screen.getByRole('button', { name: /confirm payment/i }));
  
    // Wait for error message to appear by text content
    await waitFor(() => {
      expect(screen.getByText('Failed to confirm booking')).toBeInTheDocument();
    });
  });
  
  
  
  test('logs error to console on booking confirmation failure', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
    // Mock fetch to return a failed response
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    );
  
    // Fill in payment form (only necessary if input is required before submission)
    fireEvent.change(screen.getByLabelText(/cardholder name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '1234567890123456' } });
    fireEvent.change(screen.getByLabelText(/expiration date/i), { target: { value: '12/24' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
  
    // Trigger the payment submission
    fireEvent.click(screen.getByRole('button', { name: /confirm payment/i }));
  
    // Wait for console.error to be called
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));
    });
  
    // Clean up the spy
    consoleErrorSpy.mockRestore();
  });
  
  
  
  test('displays error message for invalid card number and prevents form submission', async () => {
    // Render the BookingPayment component
    render(
      <MemoryRouter initialEntries={['/booking-payment']}>
        <Routes>
          <Route path="/booking-payment" element={<BookingPayment />} />
        </Routes>
      </MemoryRouter>
    );
  
    // Fill in payment form with invalid data (invalid card number)
    fireEvent.change(screen.getByLabelText(/cardholder name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '123' } }); // Invalid card number
    fireEvent.change(screen.getByLabelText(/expiration date/i), { target: { value: '12/24' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
  
    // Select the button correctly using a unique selector
    const confirmButton = screen.getAllByRole('button', { name: /confirm payment/i })[0]; // Get the first button if multiple exist
    
    fireEvent.click(confirmButton);
  
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/invalid card number/i)).toBeInTheDocument();
    });
  });
  
  

  

});
