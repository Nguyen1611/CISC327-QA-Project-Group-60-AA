import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingPayment from '../pages/BookingPayment';

// Mock fetch globally
global.fetch = async () => {
  return {
    ok: true,
    json: async () => ({
      message: 'Booking successful',
    }),
  };
};

describe('BookingPayment Component', () => {
  beforeEach(() => {
    render(<BookingPayment />);
  });

  test('renders the component correctly', () => {
    expect(screen.getByText(/review & secure payment/i)).toBeTruthy();
  });

  test('displays flight information correctly', () => {
    // Check for flight information in the component
    expect(screen.getByText(/toronto → vancouver/i)).toBeTruthy(); // Check for flight route
    expect(screen.getByText(/2024-10-25 14:00/i)).toBeTruthy(); // Check for departure time
    expect(screen.getByText(/2024-10-25 16:00/i)).toBeTruthy(); // Check for arrival time
  });


  test('displays error message for invalid card number', async () => {
    fireEvent.change(screen.getByLabelText(/cardholder name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '123' } }); // Invalid card number
    fireEvent.change(screen.getByLabelText(/expiration date/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123-456-7890' } });

    fireEvent.click(screen.getByText(/confirm payment/i));

    // Use a simple truthy check instead of toBeInTheDocument
    const errorMessage = await screen.findByText(/invalid card number/i);
    expect(errorMessage).toBeTruthy(); // Check if error message is truthy
  });
});
