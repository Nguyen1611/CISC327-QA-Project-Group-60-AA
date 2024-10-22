import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingPayment from '../pages/BookingPayment';
import '@testing-library/jest-dom'; 

describe('BookingPayment Component', () => {
  beforeEach(() => {
    render(<BookingPayment />);
  });

  test('renders the payment form correctly', () => {
    expect(screen.getByPlaceholderText('Card Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name on Card')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/YY')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('CVV')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByText('Confirm Payment')).toBeInTheDocument();
  });

  test('accepts and processes valid payment information', () => {
    fireEvent.change(screen.getByPlaceholderText('Card Number'), { target: { value: '1234567812345678' } });
    fireEvent.change(screen.getByPlaceholderText('Name on Card'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/25' } });
    fireEvent.change(screen.getByPlaceholderText('CVV'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });

    // Simulate form submission
    fireEvent.click(screen.getByText('Confirm Payment'));

    // Add a mock for the validation function (this can depend on your actual code)
    // Example expectation
    expect(screen.getByText('Payment Successful')).toBeInTheDocument();
  });

  test('displays error for invalid payment information', () => {
    fireEvent.change(screen.getByPlaceholderText('Card Number'), { target: { value: '123' } }); // Invalid card number
    fireEvent.change(screen.getByPlaceholderText('Name on Card'), { target: { value: '' } }); // Empty name
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/20' } }); // Expired card
    fireEvent.change(screen.getByPlaceholderText('CVV'), { target: { value: '12' } }); // Invalid CVV
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'not-an-email' } }); // Invalid email

    // Simulate form submission
    fireEvent.click(screen.getByText('Confirm Payment'));

    // Expect error messages
    expect(screen.getByText('Invalid card number')).toBeInTheDocument();
    expect(screen.getByText('Please provide a valid name')).toBeInTheDocument();
    expect(screen.getByText('Card is expired')).toBeInTheDocument();
    expect(screen.getByText('Invalid CVV')).toBeInTheDocument();
    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });

  test('displays correct flight information and price summary', () => {
    // Check for flight information being displayed
    expect(screen.getByText('Paris → Toronto')).toBeInTheDocument();
    expect(screen.getByText('Flight Time:')).toBeInTheDocument();
    expect(screen.getByText('Price:')).toBeInTheDocument();
    
    // Check the price summary
    expect(screen.getByText('Price Summary')).toBeInTheDocument();
    expect(screen.getByText('$2296')).toBeInTheDocument(); // Assuming this is the price
  });

  test('handles successful booking navigation', () => {
    // Assuming you have a way to simulate navigation after successful booking
    fireEvent.change(screen.getByPlaceholderText('Card Number'), { target: { value: '1234567812345678' } });
    fireEvent.change(screen.getByPlaceholderText('Name on Card'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('MM/YY'), { target: { value: '12/25' } });
    fireEvent.change(screen.getByPlaceholderText('CVV'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });

    fireEvent.click(screen.getByText('Confirm Payment'));

    // Assuming the navigation to confirmation or success page
    expect(screen.getByText('Booking Confirmation')).toBeInTheDocument();
  });
});
