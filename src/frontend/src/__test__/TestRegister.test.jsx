import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Register from '../pages/Register';
import '@testing-library/jest-dom';


// Mock login function
const mockLogin = vi.fn();

// Helper function to render with Router and AuthContext
const renderWithContext = (ui) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ login: mockLogin }}>
        {ui}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    renderWithContext(<Register />);
  });

  // renders the component correctly
  test('renders the component correctly', () => {
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
  
  // handles input changes correctly
  test('handles input changes correctly', () => {
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

    expect(screen.getByPlaceholderText('Email')).toHaveValue('new@example.com');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('password123');
    expect(screen.getByPlaceholderText('Confirm Password')).toHaveValue('password123');
  });

  //displays error message for password mismatch
  test('displays error message for password mismatch', async () => {
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'differentpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  // displays success message after successful registration
  test('displays success message after successful registration', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'success' }),
      })
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'new@example.com' });
      expect(screen.getByText('Registration successful!')).toBeInTheDocument();
    });
  });

  // displays error message for server error
  test('displays error message for server error', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'error', message: 'Email already exists.' }),
      })
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists.')).toBeInTheDocument();
    });
  });
});
