import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../component/Navbar';
import '@testing-library/jest-dom';

describe('Navbar Component', () => {
  // Helper function to render Navbar with Router and AuthContext
  const renderWithContext = (isAuthenticated, user, logout) => {
    return render(
      <AuthContext.Provider value={{ isAuthenticated, user, logout }}>
        <Router>
          <Navbar />
        </Router>
      </AuthContext.Provider>
    );
  };

  // renders correctly when not authenticated
  test('renders correctly when not authenticated', () => {
    renderWithContext(false, null, vi.fn());

    // Check if Sign In and Register links are present
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();

    // Check if "Welcome" message and Logout button are not present
    expect(screen.queryByText(/Welcome,/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  // renders correctly when authenticated with valid user email
  test('renders correctly when authenticated with valid user email', () => {
    const mockUser = { email: 'test@example.com' };
    renderWithContext(true, mockUser, vi.fn());

    // Check if "Welcome" message and Logout button are present
    expect(screen.getByText(`Welcome, ${mockUser.email}!`)).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Check if Sign In and Register links are not present
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  // handles case where user is authenticated but has no email
  test('handles case where user is authenticated but has no email', () => {
    renderWithContext(true, { email: null }, vi.fn());

    // Check for "Welcome" message with empty email field
    expect(screen.getByText('Welcome, !')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  // handles case where user is authenticated but user object is undefined
  test('handles case where user is authenticated but user object is undefined', () => {
    renderWithContext(true, undefined, vi.fn());

    // Check for "Welcome" message and Logout button without breaking
    expect(screen.getByText('Welcome, !')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  // calls logout function when Logout button is clicked
  test('calls logout function when Logout button is clicked', () => {
    const mockLogout = vi.fn();
    renderWithContext(true, { email: 'test@example.com' }, mockLogout);

    // Click the Logout button
    fireEvent.click(screen.getByText('Logout'));

    // Check if logout function is called
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  // Checks if active link has correct class
  test('has active class on Flights link when it is active', () => {
    renderWithContext(false, null, vi.fn());

    const flightsLink = screen.getByText('Flights');
    expect(flightsLink).toBeInTheDocument();
    expect(flightsLink.className).toContain('active');
  });
});
