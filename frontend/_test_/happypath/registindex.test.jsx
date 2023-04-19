import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../screens/Register';
import encapFetch from '../../encap';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../encap');

describe('Register', () => {
  test('renders the component and checks for successful registration', async () => {
    // Mock successful registration
    encapFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({ token: 'mocked-token' }),
    });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Register />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const nameInput = screen.getByPlaceholderText('Name');
    const registerButton = screen.getByText('Register');

    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    expect(emailInput.value).toBe('newuser@example.com');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');

    fireEvent.change(nameInput, { target: { value: 'New User' } });
    expect(nameInput.value).toBe('New User');

    fireEvent.click(registerButton);

    await waitFor(() => {
      const successMessage = screen.getByText('Registration successful! Redirecting to dashboard...');
      expect(successMessage).toBeInTheDocument();
    });
  });
});
