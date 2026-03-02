import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import auth from '@/state/features/authSlice';
import { rootApi } from '@/state/api/rootApi';
import { server } from '@/test/msw/server';

const createTestStore = () => {
	return configureStore({
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware),
		reducer: {
			auth: auth.reducer,
			[rootApi.reducerPath]: rootApi.reducer
		}
	});
};

const createTestStoreWithState = (preloadedState) => {
	return configureStore({
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware),
		preloadedState,
		reducer: {
			auth: auth.reducer,
			[rootApi.reducerPath]: rootApi.reducer
		}
	});
};

describe('auth flow with refresh tokens', () => {
	it('stores access token and refresh token on successful login', async () => {
		server.use(
			http.post('*/api/login', () => {
				return HttpResponse.json({
					accessToken: 'access-token-1',
					refreshToken: 'refresh-token-1',
					user: { user_id: 'user-1' }
				});
			})
		);

		const store = createTestStore();
		await store.dispatch(rootApi.endpoints.login.initiate({ password: 'password', username: 'username' })).unwrap();

		expect(store.getState().auth.token).toBe('access-token-1');
		expect(store.getState().auth.refreshToken).toBe('refresh-token-1');
		expect(store.getState().auth.user).toEqual({ user_id: 'user-1' });
		expect(localStorage.getItem('auth_token')).toBe('access-token-1');
		expect(localStorage.getItem('auth_refresh_token')).toBe('refresh-token-1');
	});

	it('shows friendly message on login 429', async () => {
		server.use(
			http.post('*/api/login', () => {
				return HttpResponse.json({ message: 'Rate limited' }, { status: 429 });
			})
		);

		const store = createTestStore();
		await expect(
			store.dispatch(rootApi.endpoints.login.initiate({ password: 'password', username: 'username' })).unwrap()
		).rejects.toBeDefined();

		expect(store.getState().auth.error).toBe('Too many login attempts, try again later');
	});

	it('refreshes token on 401 and retries original request once', async () => {
		let vehicleRequestCount = 0;

		server.use(
			http.post('*/api/login', () => {
				return HttpResponse.json({
					accessToken: 'old-access-token',
					refreshToken: 'old-refresh-token',
					user: { user_id: 'user-1' }
				});
			}),
			http.post('*/api/token', async ({ request }) => {
				const body = await request.json();
				expect(body).toEqual({ refreshToken: 'old-refresh-token' });
				return HttpResponse.json({
					accessToken: 'new-access-token',
					refreshToken: 'new-refresh-token'
				});
			}),
			http.get('*/api/:userId/vehicles', ({ request }) => {
				vehicleRequestCount += 1;
				const authorizationHeader = request.headers.get('authorization');

				if (vehicleRequestCount === 1) {
					expect(authorizationHeader).toBe('Bearer old-access-token');
					return HttpResponse.json({ message: 'Expired token' }, { status: 401 });
				}

				expect(authorizationHeader).toBe('Bearer new-access-token');
				return HttpResponse.json([]);
			})
		);

		const store = createTestStore();
		await store.dispatch(rootApi.endpoints.login.initiate({ password: 'password', username: 'username' })).unwrap();

		const vehicles = await store.dispatch(rootApi.endpoints.listVehicles.initiate('user-1')).unwrap();

		expect(vehicles).toEqual([]);
		expect(vehicleRequestCount).toBe(2);
		expect(store.getState().auth.token).toBe('new-access-token');
		expect(store.getState().auth.refreshToken).toBe('new-refresh-token');
		expect(localStorage.getItem('auth_token')).toBe('new-access-token');
		expect(localStorage.getItem('auth_refresh_token')).toBe('new-refresh-token');
	});

	it('clears auth state when refresh endpoint returns 401', async () => {
		server.use(
			http.post('*/api/login', () => {
				return HttpResponse.json({
					accessToken: 'old-access-token',
					refreshToken: 'old-refresh-token',
					user: { user_id: 'user-1' }
				});
			}),
			http.post('*/api/token', () => {
				return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
			}),
			http.get('*/api/:userId/vehicles', () => {
				return HttpResponse.json({ message: 'Expired token' }, { status: 401 });
			})
		);

		const store = createTestStore();
		await store.dispatch(rootApi.endpoints.login.initiate({ password: 'password', username: 'username' })).unwrap();
		await expect(store.dispatch(rootApi.endpoints.listVehicles.initiate('user-1')).unwrap()).rejects.toBeDefined();

		expect(store.getState().auth.isAuthenticated).toBe(false);
		expect(store.getState().auth.token).toBeNull();
		expect(store.getState().auth.refreshToken).toBeNull();
		expect(localStorage.getItem('auth_token')).toBeNull();
		expect(localStorage.getItem('auth_refresh_token')).toBeNull();
	});

	it('sends refresh token in logout request body', async () => {
		let logoutRequestBody;

		server.use(
			http.post('*/api/login', () => {
				return HttpResponse.json({
					accessToken: 'access-token-1',
					refreshToken: 'refresh-token-1',
					user: { user_id: 'user-1' }
				});
			}),
			http.post('*/api/logout', async ({ request }) => {
				logoutRequestBody = await request.json();
				return HttpResponse.json({ ok: true });
			})
		);

		const store = createTestStore();
		await store.dispatch(rootApi.endpoints.login.initiate({ password: 'password', username: 'username' })).unwrap();
		await store.dispatch(rootApi.endpoints.logout.initiate(store.getState().auth.refreshToken)).unwrap();

		expect(logoutRequestBody).toEqual({ refreshToken: 'refresh-token-1' });
		expect(store.getState().auth.isAuthenticated).toBe(false);
		expect(store.getState().auth.token).toBeNull();
		expect(store.getState().auth.refreshToken).toBeNull();
	});

	it('does not attempt token refresh for login endpoint failures', async () => {
		let refreshCallCount = 0;

		server.use(
			http.post('*/api/login', () => {
				return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
			}),
			http.post('*/api/token', () => {
				refreshCallCount += 1;
				return HttpResponse.json({ accessToken: 'should-not-be-used', refreshToken: 'should-not-be-used' });
			})
		);

		const store = createTestStore();
		await expect(
			store.dispatch(rootApi.endpoints.login.initiate({ password: 'bad-password', username: 'bad-user' })).unwrap()
		).rejects.toBeDefined();

		expect(refreshCallCount).toBe(0);
	});

	it('logs out when protected request gets 401 and no refresh token exists', async () => {
		server.use(
			http.get('*/api/:userId/vehicles', () => {
				return HttpResponse.json({ message: 'Expired token' }, { status: 401 });
			})
		);

		const store = createTestStoreWithState({
			auth: {
				error: null,
				isAuthenticated: true,
				refreshToken: null,
				token: 'stale-token',
				user: { user_id: 'user-1' }
			},
			[rootApi.reducerPath]: undefined
		});

		await expect(store.dispatch(rootApi.endpoints.listVehicles.initiate('user-1')).unwrap()).rejects.toBeDefined();

		expect(store.getState().auth.isAuthenticated).toBe(false);
		expect(store.getState().auth.token).toBeNull();
		expect(store.getState().auth.refreshToken).toBeNull();
	});

	it('keeps auth state when refresh attempt fails with non-401 error', async () => {
		server.use(
			http.post('*/api/login', () => {
				return HttpResponse.json({
					accessToken: 'old-access-token',
					refreshToken: 'old-refresh-token',
					user: { user_id: 'user-1' }
				});
			}),
			http.post('*/api/token', () => {
				return HttpResponse.json({ message: 'Server error' }, { status: 500 });
			}),
			http.get('*/api/:userId/vehicles', () => {
				return HttpResponse.json({ message: 'Expired token' }, { status: 401 });
			})
		);

		const store = createTestStore();
		await store.dispatch(rootApi.endpoints.login.initiate({ password: 'password', username: 'username' })).unwrap();
		await expect(store.dispatch(rootApi.endpoints.listVehicles.initiate('user-1')).unwrap()).rejects.toBeDefined();

		expect(store.getState().auth.isAuthenticated).toBe(true);
		expect(store.getState().auth.token).toBe('old-access-token');
		expect(store.getState().auth.refreshToken).toBe('old-refresh-token');
	});

	it('rejects listRepairs when required IDs are missing', async () => {
		const store = createTestStore();

		await expect(
			store.dispatch(rootApi.endpoints.listRepairs.initiate({ entityId: 'entity-1', userId: '' })).unwrap()
		).rejects.toThrow('User ID is required');

		await expect(
			store.dispatch(rootApi.endpoints.listRepairs.initiate({ entityId: '', userId: 'user-1' })).unwrap()
		).rejects.toThrow('Entity ID is required');
	});

	it('rejects listRepairParts when required IDs are missing', async () => {
		const store = createTestStore();

		await expect(
			store.dispatch(rootApi.endpoints.listRepairParts.initiate({ repairId: 'repair-1', userId: '' })).unwrap()
		).rejects.toThrow('User ID is required');

		await expect(
			store.dispatch(rootApi.endpoints.listRepairParts.initiate({ repairId: '', userId: 'user-1' })).unwrap()
		).rejects.toThrow('Repair ID is required');
	});
});
