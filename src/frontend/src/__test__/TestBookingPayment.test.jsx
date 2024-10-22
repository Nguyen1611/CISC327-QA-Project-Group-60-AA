import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingPayment from '../pages/BookingPayment';
import '@testing-library/jest-dom';

describe('BookingPayment Component', () => {
  beforeEach(() => {
    render(<BookingPayment />);
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
    // Check for flight information in the confirmation
    expect(screen.getByText(/toronto → vancouver/i)).toBeInTheDocument(); // Check for flight route
    expect(screen.getByText(/2024-10-25 14:00/i)).toBeInTheDocument(); // Check for departure time
    expect(screen.getByText(/2024-10-25 16:00/i)).toBeInTheDocument(); // Check for arrival time
  });

  test('displays price summary in booking confirmation', () => {
    // Check for price summary details
    expect(screen.getByText(/price summary/i)).toBeInTheDocument(); // Check for price summary label
    expect(screen.getByText(/flight price/i)).toBeInTheDocument(); // Check for flight price line
    expect(screen.getByText(/279/i)).toBeInTheDocument(); // Check for the specific flight price
    expect(screen.getByText(/taxes & fees/i)).toBeInTheDocument(); // Check for taxes & fees line
    expect(screen.getByText(/100/i)).toBeInTheDocument(); // Check for the specific taxes & fees
    expect(screen.getByText(/total/i)).toBeInTheDocument(); // Check for total line
    expect(screen.getByText(/379/i)).toBeInTheDocument(); // Check for the total price (279 + 100)
  });

  test('displays error message for invalid card number', () => {
    // Fill in an invalid card number
    fireEvent.change(screen.getByLabelText(/cardholder name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/expiration date/i), { target: { value: '12/25' } });
    fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123-456-7890' } });

    // Submit the form
    fireEvent.click(screen.getByText(/confirm payment/i));

    // Expect an error message for the invalid card number
    expect(screen.getByText(/invalid card number/i)).toBeInTheDocument();
  });


});
