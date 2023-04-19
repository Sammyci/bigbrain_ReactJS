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

    fireEvent.change(emailInput, { target: { value: '767719522@qq.com' } });
    expect(emailInput.value).toBe('767719522@qq.com');

    fireEvent.change(passwordInput, { target: { value: 'csx123654' } });
    expect(passwordInput.value).toBe('csx123654');
    
    fireEvent.click(loginButton);

    const registerLink = screen.getByText('Register here');

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Login success');
    });

    window.alert.mockRestore();
  });
});
