import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Login from '@/containers/login/Login.jsx';
import { validateLoginForm } from '@/containers/login/loginValidation';
import auth from '@/state/features/authSlice';
import { rootApi } from '@/state/api/rootApi';
import { server } from '@/test/msw/server';

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

const createTestStore = () => {
	return configureStore({
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware),
		reducer: {
			auth: auth.reducer,
			[rootApi.reducerPath]: rootApi.reducer
		}
	});
};

const renderLogin = (store = createTestStore()) => {
	render(
		<Provider store={store}>
			<MemoryRouter initialEntries={['/login']}>
				<Login />
			</MemoryRouter>
		</Provider>
	);

	return store;
};

describe('validateLoginForm', () => {
	it('returns username required for empty username', () => {
		const validationErrors = validateLoginForm({ password: '123456', username: '' });

		expect(validationErrors).toEqual({ username: 'Username is required' });
	});

	it('returns password required for empty password', () => {
		const validationErrors = validateLoginForm({ password: '', username: 'username' });

		expect(validationErrors).toEqual({ password: 'Password is required' });
	});

	it('returns min-length errors for short username and password', () => {
		const validationErrors = validateLoginForm({ password: '12345', username: 'ab' });

		expect(validationErrors).toEqual({
			password: 'Password must be at least 6 characters',
			username: 'Username must be at least 3 characters'
		});
	});

	it('returns no errors for valid credentials', () => {
		const validationErrors = validateLoginForm({ password: '123456', username: 'username' });

		expect(validationErrors).toEqual({});
	});
});

describe('Login', () => {
	it('prevents login request when required fields are empty', async () => {
		let loginRequestCount = 0;

		server.use(
			http.post('*/api/login', () => {
				loginRequestCount += 1;
				return HttpResponse.json({ message: 'Should not be called' }, { status: 500 });
			})
		);

		renderLogin();
		const usernameInput = screen.getByLabelText(/Username/i);
		const passwordInput = screen.getByLabelText(/Password/i);

		fireEvent.click(await screen.findByRole('button', { name: 'Login' }));

		expect(usernameInput).toBeRequired();
		expect(passwordInput).toBeRequired();
		await waitFor(() => {
			expect(loginRequestCount).toBe(0);
		});
	});

	it('prevents login request when username is empty', () => {
		let loginRequestCount = 0;

		server.use(
			http.post('*/api/login', () => {
				loginRequestCount += 1;
				return HttpResponse.json({ message: 'Should not be called' }, { status: 500 });
			})
		);

		renderLogin();

		fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123456' } });
		fireEvent.click(screen.getByRole('button', { name: 'Login' }));

		expect(screen.getByLabelText(/Username/i)).toBeRequired();
		expect(loginRequestCount).toBe(0);
	});

	it('prevents login request when password is empty', () => {
		let loginRequestCount = 0;

		server.use(
			http.post('*/api/login', () => {
				loginRequestCount += 1;
				return HttpResponse.json({ message: 'Should not be called' }, { status: 500 });
			})
		);

		renderLogin();

		fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'username' } });
		fireEvent.click(screen.getByRole('button', { name: 'Login' }));

		expect(screen.getByLabelText(/Password/i)).toBeRequired();
		expect(loginRequestCount).toBe(0);
	});

	it('shows minimum length validation messages for short credentials', async () => {
		let loginRequestCount = 0;

		server.use(
			http.post('*/api/login', () => {
				loginRequestCount += 1;
				return HttpResponse.json({ message: 'Should not be called' }, { status: 500 });
			})
		);

		renderLogin();

		fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'ab' } });
		fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '12345' } });
		fireEvent.click(screen.getByRole('button', { name: 'Login' }));

		expect(await screen.findByText('Username must be at least 3 characters')).toBeInTheDocument();
		expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();
		expect(loginRequestCount).toBe(0);
	});

	it('clears username validation error when user types again', async () => {
		renderLogin();

		fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'ab' } });
		fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123456' } });
		fireEvent.click(screen.getByRole('button', { name: 'Login' }));

		expect(await screen.findByText('Username must be at least 3 characters')).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'abc' } });

		expect(screen.queryByText('Username must be at least 3 characters')).not.toBeInTheDocument();
	});

	it('renders 429 login message from auth state', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {
		});

		server.use(
			http.post('*/api/login', () => {
				return HttpResponse.json({ message: 'Rate limited' }, { status: 429 });
			})
		);

		renderLogin();

		fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'username' } });
		fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
		fireEvent.click(screen.getByRole('button', { name: 'Login' }));

		expect(await screen.findByText('Too many login attempts, try again later')).toBeInTheDocument();
	});
});
