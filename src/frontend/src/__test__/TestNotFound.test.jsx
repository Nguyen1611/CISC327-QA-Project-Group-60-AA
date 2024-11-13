import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import '@testing-library/jest-dom';

describe('NotFound Component', () => {
  test('renders 404 page with correct message', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );

    // Check if "404 - Page Not Found" text is present
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });
});
