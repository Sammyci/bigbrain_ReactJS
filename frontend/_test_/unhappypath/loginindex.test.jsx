import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../screens/Login';

describe('Login', () => {
  test('renders the component and checks for interactions', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    expect(emailInput.value).toBe('test@test.com');

    fireEvent.change(passwordInput, { target: { value: 'test1234' } });
    expect(passwordInput.value).toBe('test1234');
    
    fireEvent.click(loginButton);

    const registerLink = screen.getByText('Register here');

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid username or password');
    });

    window.alert.mockRestore();
  });
});
