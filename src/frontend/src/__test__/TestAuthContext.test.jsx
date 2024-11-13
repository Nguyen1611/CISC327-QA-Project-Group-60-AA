import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import '@testing-library/jest-dom';

// Helper component to consume AuthContext values
const AuthConsumer = () => {
  const { isAuthenticated, user, login, logout } = React.useContext(AuthContext);

  return (
    <div>
      <p data-testid="isAuthenticated">{isAuthenticated.toString()}</p>
      <p data-testid="user">{user ? user.email : 'null'}</p>
      <button onClick={() => login({ email: 'test@example.com' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  test('initial context values are correct', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Check initial values
    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });

  test('login function updates context correctly', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Click the login button
    screen.getByText('Login').click();

    // Wait for the state to update
    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  test('logout function updates context correctly', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Login first
    screen.getByText('Login').click();

    // Logout and wait for state update
    screen.getByText('Logout').click();

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });
});
