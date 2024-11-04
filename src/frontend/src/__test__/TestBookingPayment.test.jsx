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

});
