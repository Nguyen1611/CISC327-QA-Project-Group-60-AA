import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SignIn from '../pages/SignIn';
import '@testing-library/jest-dom';

describe('SignIn Component', () => {
  // Mock login function
  const mockLogin = vi.fn();

  // Helper function to render with Router and AuthContext
  const renderWithContext = (component) => {
    return render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Router>{component}</Router>
      </AuthContext.Provider>
    );
  };

  test('renders the component correctly', () => {
    renderWithContext(<SignIn />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getAllByText('Sign In').length).toBeGreaterThan(0); // Check if at least one "Sign In" exists
  });

  test('handles email and password input', () => {
    renderWithContext(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    expect(screen.getByPlaceholderText('Email')).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('password123');
  });

  test('displays success message after successful login', async () => {
    // Mock fetch success response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'success' }),
      })
    );

    renderWithContext(<SignIn />);

    // Input values
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    // Click Sign In button
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Login successful!')).toBeInTheDocument();
    });

    // Ensure login function is called
    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  test('displays error message for invalid credentials', async () => {
    // Mock fetch error response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'error', message: 'Invalid credentials.' }),
      })
    );

    renderWithContext(<SignIn />);

    // Input values
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

    // Click Sign In button
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials.')).toBeInTheDocument();
    });
  });
});
