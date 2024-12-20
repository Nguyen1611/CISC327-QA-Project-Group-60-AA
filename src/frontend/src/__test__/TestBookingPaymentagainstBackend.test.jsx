import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import BookingPayment from '../pages/BookingPayment';
import '@testing-library/jest-dom';

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
    render(
      <MemoryRouter>
        <BookingPayment />
      </MemoryRouter>
    ); // Wrap BookingPayment in MemoryRouter
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
