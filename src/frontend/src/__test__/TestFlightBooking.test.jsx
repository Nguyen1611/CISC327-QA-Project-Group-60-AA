import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FlightBooking from '../pages/FlightBooking';
import '@testing-library/jest-dom';

describe('FlightBooking Component', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  // Mock data to simulate the API response
  const mockFlightData = {
    flights: [
      {
        _id: '6726f3585edf20eb09d8f398',
        fromLocation: 'Toronto',
        toLocation: 'Vancouver',
        price: 279,
        img: 'toronto-vancouver.jpg',
        tripType: 'Round Trip',
        date: '2024-12-01',
        'Available Seats': [
          { seat: '1A', available: true },
          { seat: '1B', available: false },
        ],
      },
    ],
  };

  // Mock fetch before each test
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockFlightData),
      })
    );

    renderWithRouter(<FlightBooking />);
  });

  afterEach(() => {
    global.fetch.mockClear(); // Clear mock after each test
  });

  test('renders the component correctly', () => {
    expect(screen.getByPlaceholderText('Flight from?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Where to?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Depart')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Return')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('filters flights based on search criteria', async () => {
    fireEvent.change(screen.getByPlaceholderText('Flight from?'), { target: { value: 'Toronto' } });
    fireEvent.change(screen.getByPlaceholderText('Where to?'), { target: { value: 'Vancouver' } });
    fireEvent.change(screen.getByPlaceholderText('Depart'), { target: { value: '2024-12-01' } });
    fireEvent.change(screen.getByPlaceholderText('Return'), { target: { value: '2024-12-31' } });

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('Toronto → Vancouver')).toBeInTheDocument();
    });
  });
});
