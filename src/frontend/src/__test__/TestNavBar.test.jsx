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

  test('renders correctly when not authenticated', () => {
    renderWithContext(false, null, vi.fn());

    // Check if Sign In and Register links are present
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();

    // Check if "Welcome" message and Logout button are not present
    expect(screen.queryByText(/Welcome,/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  test('renders correctly when authenticated', () => {
    const mockUser = { email: 'test@example.com' };
    renderWithContext(true, mockUser, vi.fn());

    // Check if "Welcome" message and Logout button are present
    expect(screen.getByText(`Welcome, ${mockUser.email}!`)).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Check if Sign In and Register links are not present
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  test('calls logout function when Logout button is clicked', () => {
    const mockLogout = vi.fn();
    renderWithContext(true, { email: 'test@example.com' }, mockLogout);

    // Click the Logout button
    fireEvent.click(screen.getByText('Logout'));

    // Check if logout function is called
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
