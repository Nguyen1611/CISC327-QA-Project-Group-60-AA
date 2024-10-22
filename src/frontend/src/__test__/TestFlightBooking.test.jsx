import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlightBooking from '../pages/FlightBooking';
import '@testing-library/jest-dom'; 

describe('FlightBooking Component', () => {
  beforeEach(() => {
    render(<FlightBooking />);
  });

  test('renders the component correctly', () => {
    expect(screen.getByPlaceholderText('Flight from?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Where to?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Depart')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Return')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('filters flights based on search criteria', () => {
    // Input values for search
    fireEvent.change(screen.getByPlaceholderText('Flight from?'), { target: { value: 'Toronto' } });
    fireEvent.change(screen.getByPlaceholderText('Where to?'), { target: { value: 'Vancouver' } });

    // Set date range
    fireEvent.change(screen.getByPlaceholderText('Depart'), { target: { value: '2024-12-01' } });
    fireEvent.change(screen.getByPlaceholderText('Return'), { target: { value: '2024-12-31' } });


    // Check that the correct flight is displayed
    expect(screen.getByText('Toronto → Vancouver')).toBeInTheDocument();
  });

  test('changes trip type correctly', () => {
    const roundTripRadio = screen.getByLabelText('Round Trip');
    const oneWayRadio = screen.getByLabelText('One Way');

    // Ensure Round Trip is selected by default
    expect(roundTripRadio).toBeChecked();
    expect(oneWayRadio).not.toBeChecked();

    // Change trip type to One Way
    fireEvent.click(oneWayRadio);
    expect(oneWayRadio).toBeChecked();
    expect(roundTripRadio).not.toBeChecked();
  });

  test('does not show flights outside of the date range', () => {
    // Input values for search
    fireEvent.change(screen.getByPlaceholderText('Flight from?'), { target: { value: 'Toronto' } });
    fireEvent.change(screen.getByPlaceholderText('Where to?'), { target: { value: 'Montreal' } });

    // Set date range that does not include any flights
    fireEvent.change(screen.getByPlaceholderText('Depart'), { target: { value: '2024-12-05' } });
    fireEvent.change(screen.getByPlaceholderText('Return'), { target: { value: '2024-12-10' } });

    // Click the search button
    fireEvent.click(screen.getByText('Search'));

    // No flights should be shown
    expect(screen.queryByText('Toronto → Montreal')).not.toBeInTheDocument();
  });
});
