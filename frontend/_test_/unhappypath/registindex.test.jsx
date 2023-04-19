import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../screens/Register';

describe('Register', () => {
  test('renders the component and checks for interactions', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Register />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const nameInput = screen.getByPlaceholderText('Name');
    const registerButton = screen.getByText('Register');

    fireEvent.change(emailInput, { target: { value: '767719522@qq.com' } });
    expect(emailInput.value).toBe('767719522@qq.com');

    fireEvent.change(passwordInput, { target: { value: 'csx123654' } });
    expect(passwordInput.value).toBe('csx123654');

    fireEvent.change(nameInput, { target: { value: 'Sam Ci' } });
    expect(nameInput.value).toBe('Sam Ci');

    fireEvent.click(registerButton);

    const loginLink = screen.getByText('Login here');

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('There is already a registered account with that email');
    });

    window.alert.mockRestore();
  });
});
