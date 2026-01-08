import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with auth token handling for equipment
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

export const equipmentApi = createApi({
  reducerPath: 'equipmentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Equipment'],
  endpoints: (builder) => ({
    // Equipment endpoints
    list: builder.query({
      query: (userId) => `/equipment?user=${userId}`,
      providesTags: ['Equipment'],
    }),
    
    read: builder.query({
      query: (id) => `/equipment/${id}`,
      providesTags: (result, error, id) => [{ type: 'Equipment', id }],
    }),
    
    create: builder.mutation({
      query: ({ equipmentData, userId }) => ({
        url: `/equipment?user=${userId}`,
        method: 'POST',
        body: equipmentData,
      }),
      invalidatesTags: ['Equipment'],
    }),
    
    update: builder.mutation({
      query: ({ id, equipmentData }) => ({
        url: `/equipment/${id}`,
        method: 'PUT',
        body: equipmentData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Equipment', id }],
    }),
    
    delete: builder.mutation({
      query: (id) => ({
        url: `/equipment/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Equipment', id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useListQuery,
  useReadQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = equipmentApi;
export default equipmentApi;