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
    // Check for updated flight information based on new default data
    expect(screen.getByText(/toronto → montreal/i)).toBeTruthy(); // Updated flight route
    expect(screen.getByText(/2024-12-01/i)).toBeTruthy(); // Updated departure date
    expect(screen.getByText(/one way/i)).toBeTruthy(); // Check for trip type
  });

});
