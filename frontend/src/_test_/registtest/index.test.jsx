import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../screens/Register';

describe('Register', () => {
  test('renders the component and checks for interactions', async () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <Register />
      </MemoryRouter>
    );

    // Test if input elements and button are in the document
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const nameInput = screen.getByPlaceholderText('Name');
    const registerButton = screen.getByText('Register');
    const loginLink = screen.getByText('Login here');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });
});