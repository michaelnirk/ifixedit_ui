import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with auth token handling for vehicles
const baseQuery = fetchBaseQuery({
	baseUrl: '/api',
	prepareHeaders: (headers, { getState }) => {
		// Get token from auth state
		const token = getState().auth.token;

		if (token) {
			headers.set('authorization', `Bearer ${token}`);
		}

		return headers;
	}
});

// Base query with auth error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		// Token expired or invalid - dispatch logout action
		api.dispatch({ type: 'auth/logout' });
	}

	return result;
};

export const rootApi = createApi({
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		createRepair: builder.mutation({
			invalidatesTags: ['Repair', 'Vehicle'],
			query: ({ repairData, userId }) => {
				console.log('repairApi list query called with userId:', userId);
				return {
					body: repairData,
					method: 'POST',
					url: `/${userId}/repairs`
				};
			}
		}),
		createRepairPart: builder.mutation({
			invalidatesTags: ['Part', 'Repair'],
			query: ({ repairPartData, userId }) => {
				console.log('repairApi list query called with userId:', userId);
				return {
					body: repairPartData,
					method: 'POST',
					url: `/${userId}/parts`
				};
			}
		}),
		createVehicle: builder.mutation({
			invalidatesTags: ['Vehicle'],
			query: ({ vehicleData, userId }) => ({
				body: vehicleData,
				method: 'POST',
				url: `/${userId}/vehicles`
			})
		}),
		deleteNote: builder.mutation({
			invalidatesTags: ['Note'],
			query: ({ id, userId }) => ({
				method: 'DELETE',
				url: `/${userId}/notes/${id}`
			})
		}),
		deleteRepair: builder.mutation({
			invalidatesTags: (result, error, { repairId }) => [
				{ id: repairId, type: 'Repair' },
				'Repair', // This will invalidate the list query
				'Vehicle' // Invalidate vehicle data as repairs may affect it
			],
			query: ({ repairId, userId }) => ({
				method: 'DELETE',
				url: `/${userId}/repairs/${repairId}`
			})
		}),
		deleteRepairPart: builder.mutation({
			invalidatesTags: (result, error, { partId }) => [
				{ id: partId, type: 'Part' },
				'Part', // This will invalidate the list query
				'Repair' // Invalidate repair data as repairs may affect it
			],
			query: ({ partId, userId }) => ({
				method: 'DELETE',
				url: `/${userId}/parts/${partId}`
			})
		}),
		deleteVehicle: builder.mutation({
			invalidatesTags: (result, error, { vehicleId }) => [
				{ id: vehicleId, type: 'Vehicle' },
				'Vehicle' // This will invalidate the list query
			],
			query: ({ vehicleId, userId }) => ({
				method: 'DELETE',
				url: `/${userId}/vehicles/${vehicleId}`
			})
		}),
		getRepair: builder.query({
			providesTags: (result, error, { repairId }) => [{ id: repairId, type: 'Repair' }],
			query: ({ repairId, userId }) => `/${userId}/repairs/${repairId}`
		}),
		getRepairPart: builder.query({
			providesTags: (result, error, { partId }) => [{ id: partId, type: 'Part' }],
			query: ({ partId, userId }) => `/${userId}/parts/${partId}`
		}),
		getVehicle: builder.query({
			providesTags: (result, error, { vehicleId }) => [{ id: vehicleId, type: 'Vehicle' }],
			query: ({ userId, vehicleId }) => `/${userId}/vehicles/${vehicleId}`
		}),
		listCurrencies: builder.query({
			providesTags: ['Currency'],
			query: (userId) => {
				if (!userId) {
					throw new Error('User ID is required');
				}
				return `/${userId}/currencies`;
			}
		}),
		listEndItems: builder.query({
			providesTags: ['EndItem'],
			query: (userId) => {
				if (!userId) {
					throw new Error('User ID is required');
				}
				return `/${userId}/end_items`;
			}
		}),
		listRepairParts: builder.query({
			providesTags: ['Part'],
			query: ({ userId, repairId }) => {
				if (!userId) {
					throw new Error('User ID is required');
				}
				if (!repairId) {
					throw new Error('Repair ID is required');
				}
				const url = `/${userId}/parts/${repairId}/all`;
				return url;
			}
		}),
		listRepairs: builder.query({
			providesTags: ['Repair'],
			query: ({ userId, vehicleId }) => {
				if (!userId) {
					throw new Error('User ID is required');
				}
				if (!vehicleId) {
					throw new Error('Vehicle ID is required');
				}
				const url = `/${userId}/repairs/${vehicleId}/all`;
				return url;
			}
		}),
		listStructures: builder.query({
			providesTags: ['Structure'],
			query: (userId) => {
				if (!userId) {
					throw new Error('User ID is required');
				}
				return `/${userId}/structures`;
			}
		}),
		listVehicles: builder.query({
			providesTags: ['Vehicle'],
			query: (userId) => {
				if (!userId) {
					throw new Error('User ID is required');
				}
				return `/${userId}/vehicles`;
			}
		}),
		login: builder.mutation({
			query: (credentials) => ({
				body: credentials,
				method: 'POST',
				url: '/login'
			}),
			transformResponse: (response) => ({
				token: response.accessToken,
				user: response.user || null
			})
		}),
		logout: builder.mutation({
			query: () => ({
				method: 'POST',
				url: '/logout'
			})
		}),
		updateRepair: builder.mutation({
			invalidatesTags: (result, error, { repairId }) => [
				{ id: repairId, type: 'Repair' },
				'Repair' // This will invalidate the list query
			],
			query: ({ repairId, repairData, userId }) => ({
				body: repairData,
				method: 'PUT',
				url: `/${userId}/repairs/${repairId}`
			})
		}),
		updateRepairPart: builder.mutation({
			invalidatesTags: (result, error, { partId }) => [
				{ id: partId, type: 'Part' },
				'Part' // This will invalidate the list query
			],
			query: ({ partId, repairPartData, userId }) => ({
				body: repairPartData,
				method: 'PUT',
				url: `/${userId}/parts/${partId}`
			})
		}),
		updateVehicle: builder.mutation({
			invalidatesTags: (result, error, { vehicleId }) => [
				{ id: vehicleId, type: 'Vehicle' },
				'Vehicle' // This will invalidate the list query
			],
			query: ({ vehicleId, vehicleData, userId }) => ({
				body: vehicleData,
				method: 'PUT',
				url: `/${userId}/vehicles/${vehicleId}`
			})
		})
	}),
	reducerPath: 'rootApi',
	// Use the base query with reauth handling
	tagTypes: ['Currency', 'Note', 'Vehicle', 'Repair', 'EndItem', 'Part']
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useListEndItemsQuery,
	useListCurrenciesQuery,
	useDeleteNoteMutation,
	useListVehiclesQuery,
	useGetVehicleQuery,
	useCreateVehicleMutation,
	useUpdateVehicleMutation,
	useDeleteVehicleMutation,
	useListRepairsQuery,
	useGetRepairQuery,
	useCreateRepairMutation,
	useUpdateRepairMutation,
	useDeleteRepairMutation,
	useListRepairPartsQuery,
	useGetRepairPartQuery,
	useCreateRepairPartMutation,
	useUpdateRepairPartMutation,
	useDeleteRepairPartMutation
	// Export additional hooks as you add endpoints
} = rootApi;
export const { getVehicle, getRepair, getRepairPart } = rootApi.endpoints;
export default rootApi;
