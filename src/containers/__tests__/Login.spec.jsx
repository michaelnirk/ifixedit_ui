import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Login from '@/containers/Login.jsx';
import auth from '@/state/features/authSlice';
import { rootApi } from '@/state/api/rootApi';
import { server } from '@/test/msw/server';

afterEach(() => {
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

describe('Login', () => {
	it('renders 429 login message from auth state', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {
		});

		server.use(
			http.post('*/api/login', () => {
				return HttpResponse.json({ message: 'Rate limited' }, { status: 429 });
			})
		);

		const store = createTestStore();

		render(
			<Provider store={store}>
				<MemoryRouter initialEntries={['/login']}>
					<Login />
				</MemoryRouter>
			</Provider>
		);

		fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'username' } });
		fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
		fireEvent.click(screen.getByRole('button', { name: 'Login' }));

		expect(await screen.findByText('Too many login attempts, try again later')).toBeInTheDocument();
	});
});
