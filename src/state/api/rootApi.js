import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const isTestRuntime = Boolean(import.meta.env?.VITEST);
const API_BASE_URL = isTestRuntime || typeof window === 'undefined' ? 'http://localhost/api' : '/api';

// Base query with auth token handling for vehicles
const baseQuery = fetchBaseQuery({
	baseUrl: API_BASE_URL,
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
	const requestUrl = typeof args === 'string' ? args : args.url;
	const isAuthRequest = requestUrl === '/login' || requestUrl === '/logout' || requestUrl === '/token';
	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401 && !isAuthRequest) {
		const refreshToken = api.getState().auth.refreshToken;

		if (!refreshToken) {
			api.dispatch({ type: 'auth/logout' });
			return result;
		}

		const refreshResult = await baseQuery(
			{
				body: { refreshToken },
				method: 'POST',
				url: '/token'
			},
			api,
			extraOptions
		);

		if (refreshResult.data?.accessToken && refreshResult.data?.refreshToken) {
			api.dispatch({
				payload: {
					accessToken: refreshResult.data.accessToken,
					refreshToken: refreshResult.data.refreshToken
				},
				type: 'auth/setTokens'
			});

			result = await baseQuery(args, api, extraOptions);
		} else if (refreshResult.error?.status === 401) {
			api.dispatch({ type: 'auth/logout' });
		}
	}

	return result;
};

export const rootApi = createApi({
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		createEquipment: builder.mutation({
			invalidatesTags: ['Equipment'],
			query: ({ equipmentData, userId }) => ({
				body: equipmentData,
				method: 'POST',
				url: `/${userId}/equipment`
			})
		}),
		createRepair: builder.mutation({
			invalidatesTags: ['Repair', 'Vehicle'],
			query: ({ repairData, userId }) => {
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
				return {
					body: repairPartData,
					method: 'POST',
					url: `/${userId}/parts`
				};
			}
		}),
		createStructure: builder.mutation({
			invalidatesTags: ['Structure'],
			query: ({ structureData, userId }) => ({
				body: structureData,
				method: 'POST',
				url: `/${userId}/structures`
			})
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
		getEquipment: builder.query({
			providesTags: (result, error, { equipmentId }) => [{ id: equipmentId, type: 'Equipment' }],
			query: ({ equipmentId, userId }) => `/${userId}/equipment/${equipmentId}`
		}),
		getRepair: builder.query({
			providesTags: (result, error, { repairId }) => [{ id: repairId, type: 'Repair' }],
			query: ({ repairId, userId }) => `/${userId}/repairs/${repairId}`
		}),
		getRepairPart: builder.query({
			providesTags: (result, error, { partId }) => [{ id: partId, type: 'Part' }],
			query: ({ partId, userId }) => `/${userId}/parts/${partId}`
		}),
		getStructure: builder.query({
			providesTags: (result, error, { structureId }) => [{ id: structureId, type: 'Structure' }],
			query: ({ userId, structureId }) => `/${userId}/structures/${structureId}`
		}),
		getVehicle: builder.query({
			providesTags: (result, error, { vehicleId }) => [{ id: vehicleId, type: 'Vehicle' }],
			query: ({ userId, vehicleId }) => `/${userId}/vehicles/${vehicleId}`
		}),
		listAcquisitionMethods: builder.query({
			providesTags: ['AcquisitionMethod'],
			query: (userId) => {
				if (!userId) {
					throw new Error('User ID is required');
				}
				return `/${userId}/acquisition_methods`;
			}
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
		listEquipment: builder.query({
			providesTags: ['Equipment'],
			query: (userId) => {
				if (!userId) {
					throw new Error('User ID is required');
				}
				return `/${userId}/equipment`;
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
			query: ({ entityId, userId }) => {
				if (!userId) {
					throw new Error('User ID is required');
				}
				if (!entityId) {
					throw new Error('Entity ID is required');
				}
				const url = `/${userId}/repairs/${entityId}/all`;
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
				accessToken: response.accessToken,
				refreshToken: response.refreshToken,
				user: response.user || null
			})
		}),
		logout: builder.mutation({
			query: (refreshToken) => ({
				body: { refreshToken },
				method: 'POST',
				url: '/logout'
			})
		}),
		updateEquipment: builder.mutation({
			invalidatesTags: (result, error, { equipmentId }) => [
				{ id: equipmentId, type: 'Equipment' },
				'Equipment' // This will invalidate the list query
			],
			query: ({ equipmentId, equipmentData, userId }) => ({
				body: equipmentData,
				method: 'PUT',
				url: `/${userId}/equipment/${equipmentId}`
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
		updateStructure: builder.mutation({
			invalidatesTags: (result, error, { structureId }) => [
				{ id: structureId, type: 'Structure' },
				'Structure' // This will invalidate the list query
			],
			query: ({ structureId, structureData, userId }) => ({
				body: structureData,
				method: 'PUT',
				url: `/${userId}/structures/${structureId}`
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
	tagTypes: ['Currency', 'Note', 'Vehicle', 'Repair', 'EndItem', 'Part', 'Structure', 'AcquisitionMethod', 'Equipment']
});

export const {
	useCreateEquipmentMutation,
	useCreateRepairMutation,
	useCreateRepairPartMutation,
	useCreateStructureMutation,
	useCreateVehicleMutation,
	useDeleteNoteMutation,
	useDeleteRepairMutation,
	useDeleteRepairPartMutation,
	useGetEquipmentQuery,
	useGetRepairPartQuery,
	useGetRepairQuery,
	useGetStructureQuery,
	useGetVehicleQuery,
	useListCurrenciesQuery,
	useListAcquisitionMethodsQuery,
	useListEndItemsQuery,
	useListEquipmentQuery,
	useListRepairPartsQuery,
	useListRepairsQuery,
	useListStructuresQuery,
	useListVehiclesQuery,
	useLoginMutation,
	useLogoutMutation,
	useUpdateEquipmentMutation,
	useUpdateRepairMutation,
	useUpdateRepairPartMutation,
	useUpdateStructureMutation,
	useUpdateVehicleMutation
	// Export additional hooks as you add endpoints
} = rootApi;
export default rootApi;
