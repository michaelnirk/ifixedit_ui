import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import auth from '@/state/features/authSlice';
import notification from '@/state/features/notificationSlice';
import vehiclesList, { setSearchFilter, setShowArchived, setSortedBy } from './slice';
import VehiclesList from './VehiclesList';

const mockNavigate = vi.fn();
const mockUseListVehiclesQuery = vi.fn();
const mockUseListCurrenciesQuery = vi.fn();
let mockVehicleData = [];

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		Outlet: () => <div data-testid="outlet" />,
		useNavigate: () => mockNavigate
	};
});

vi.mock('@/state/api/rootApi', async () => {
	const actual = await vi.importActual('@/state/api/rootApi');
	return {
		...actual,
		useListCurrenciesQuery: (...args) => mockUseListCurrenciesQuery(...args),
		useListVehiclesQuery: (...args) => mockUseListVehiclesQuery(...args)
	};
});

vi.mock('@/containers/vehicles/vehicles-list/selectors', () => ({
	selectSortedVehicleData: () => mockVehicleData
}));

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

const createTestStore = (preloadedState = {}) => {
	return configureStore({
		preloadedState,
		reducer: {
			auth: auth.reducer,
			notification,
			vehiclesList: vehiclesList.reducer
		}
	});
};

const renderVehiclesList = (preloadedState = {}) => {
	const store = createTestStore(preloadedState);
	render(
		<Provider store={store}>
			<VehiclesList />
		</Provider>
	);
	return store;
};

describe('VehiclesList', () => {
	beforeEach(() => {
		mockNavigate.mockReset();
		mockUseListVehiclesQuery.mockReset();
		mockUseListCurrenciesQuery.mockReset();
		mockVehicleData = [];

		mockUseListVehiclesQuery.mockReturnValue({
			isError: false,
			isLoading: false
		});

		mockUseListCurrenciesQuery.mockReturnValue({
			data: [],
			isError: false,
			isLoading: false
		});
	});

	it('shows login warning when user is missing', () => {
		renderVehiclesList({
			auth: {
				error: null,
				isAuthenticated: false,
				refreshToken: null,
				token: null,
				user: null
			}
		});

		expect(screen.getByText('Please log in to view vehicles.')).toBeInTheDocument();
		expect(mockUseListVehiclesQuery).toHaveBeenCalledWith(undefined, { skip: true });
		expect(mockUseListCurrenciesQuery).toHaveBeenCalledWith(undefined, { skip: true });
	});

	it('renders loading spinner while list queries are loading', () => {
		mockUseListVehiclesQuery.mockReturnValue({
			isError: false,
			isLoading: true
		});

		renderVehiclesList({
			auth: {
				error: null,
				isAuthenticated: true,
				refreshToken: 'refresh-token',
				token: 'token',
				user: { user_id: 'user-1' }
			}
		});

		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	it('navigates to create route when Add Vehicle is clicked', async () => {
		renderVehiclesList({
			auth: {
				error: null,
				isAuthenticated: true,
				refreshToken: 'refresh-token',
				token: 'token',
				user: { user_id: 'user-1' }
			}
		});

		fireEvent.click(await screen.findByRole('button', { name: 'Add Vehicle' }));

		expect(mockNavigate).toHaveBeenCalledWith('create');
	});

	it('dispatches descending sort when clicking the active Name column', async () => {
		const store = renderVehiclesList({
			auth: {
				error: null,
				isAuthenticated: true,
				refreshToken: 'refresh-token',
				token: 'token',
				user: { user_id: 'user-1' }
			}
		});

		fireEvent.click(await screen.findByRole('button', { name: 'Name' }));

		expect(store.getState().vehiclesList.sortedBy).toEqual(setSortedBy({ direction: 'desc', field: 'name' }).payload);
	});

	it('dispatches setShowArchived when archived switch is toggled', () => {
		const store = renderVehiclesList({
			auth: {
				error: null,
				isAuthenticated: true,
				refreshToken: 'refresh-token',
				token: 'token',
				user: { user_id: 'user-1' }
			}
		});

		fireEvent.click(screen.getByLabelText('Show Archived Vehicles'));

		expect(store.getState().vehiclesList.showArchived).toBe(setShowArchived(true).payload);
	});

	it('updates searchFilter when typing in search box', () => {
		const store = renderVehiclesList({
			auth: {
				error: null,
				isAuthenticated: true,
				refreshToken: 'refresh-token',
				token: 'token',
				user: { user_id: 'user-1' }
			}
		});

		fireEvent.change(screen.getByPlaceholderText('Search vehicles'), { target: { value: 'toyota' } });

		expect(store.getState().vehiclesList.searchFilter).toBe(setSearchFilter('toyota').payload);
	});

	it('dispatches error notification when vehicles query fails', () => {
		mockUseListVehiclesQuery.mockReturnValue({
			isError: true,
			isLoading: false
		});

		const store = renderVehiclesList({
			auth: {
				error: null,
				isAuthenticated: true,
				refreshToken: 'refresh-token',
				token: 'token',
				user: { user_id: 'user-1' }
			}
		});

		expect(store.getState().notification.message).toBe('Error loading vehicles');
		expect(store.getState().notification.severity).toBe('error');
	});

	it('navigates to vehicle edit route from row action', () => {
		mockVehicleData = [
			{
				archived: false,
				date_purchased: '2024-01-01',
				key_code: 'K1',
				km_at_purchase: 1000,
				license_plate: 'ABC123',
				make: 'Toyota',
				model: 'Corolla',
				name: 'Daily Driver',
				purchase_currency: 'usd',
				purchase_price: 12000,
				repair_count: 2,
				vehicle_id: 'vehicle-1',
				vin: 'VIN123',
				year: 2020
			}
		];

		mockUseListCurrenciesQuery.mockReturnValue({
			data: [{ currency_code: 'USD', currency_id: 'usd', currency_language: 'en-US' }],
			isError: false,
			isLoading: false
		});

		renderVehiclesList({
			auth: {
				error: null,
				isAuthenticated: true,
				refreshToken: 'refresh-token',
				token: 'token',
				user: { user_id: 'user-1' }
			}
		});

		expect(screen.getByText('Daily Driver')).toBeInTheDocument();
		fireEvent.click(screen.getByTestId('EditIcon').closest('button'));

		expect(mockNavigate).toHaveBeenCalledWith('vehicle-1/edit');
	});

	it('navigates to vehicle repairs route from row action', () => {
		mockVehicleData = [
			{
				archived: false,
				date_purchased: '2024-01-01',
				key_code: 'K1',
				km_at_purchase: 1000,
				license_plate: 'ABC123',
				make: 'Toyota',
				model: 'Corolla',
				name: 'Daily Driver',
				purchase_currency: 'usd',
				purchase_price: 12000,
				repair_count: 2,
				vehicle_id: 'vehicle-1',
				vin: 'VIN123',
				year: 2020
			}
		];

		renderVehiclesList({
			auth: {
				error: null,
				isAuthenticated: true,
				refreshToken: 'refresh-token',
				token: 'token',
				user: { user_id: 'user-1' }
			}
		});

		fireEvent.click(screen.getByTestId('CarRepairIcon').closest('button'));

		expect(mockNavigate).toHaveBeenCalledWith('vehicle-1/repairs');
	});
});
