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
  },
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

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Vehicle'],
  endpoints: (builder) => ({
    // Vehicle endpoints
    list: builder.query({
      query: (userId) => {
        if (!userId) {
          throw new Error('User ID is required');
        }
        return `/${userId}/vehicles`;
      },
      providesTags: ['Vehicle'],
    }),
    
    read: builder.query({
      query: ({ id, userId }) => `/${userId}/vehicles/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'Vehicle', id }],
    }),
    
    create: builder.mutation({
      query: ({ vehicleData, userId }) => ({
        url: `/${userId}/vehicles`,
        method: 'POST',
        body: vehicleData,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    
    update: builder.mutation({
      query: ({ id, vehicleData, userId }) => ({
        url: `/${userId}/vehicles/${id}`,
        method: 'PUT',
        body: vehicleData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Vehicle', id },
        'Vehicle' // This will invalidate the list query
      ],
    }),
    
    delete: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/${userId}/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Vehicle', id },
        'Vehicle' // This will invalidate the list query
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useListQuery, useReadQuery, useCreateMutation, useUpdateMutation, useDeleteMutation } = vehicleApi;
export const { list, read, create, update, delete: deleteVehicle } = vehicleApi.endpoints;
export default vehicleApi;