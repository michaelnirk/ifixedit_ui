import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with auth token handling for structures
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

export const structureApi = createApi({
  reducerPath: 'structureApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Structure'],
  endpoints: (builder) => ({
    // Structure endpoints
    list: builder.query({
      query: (userId) => `/structures?user=${userId}`,
      providesTags: ['Structure'],
    }),
    
    read: builder.query({
      query: (id) => `/structures/${id}`,
      providesTags: (result, error, id) => [{ type: 'Structure', id }],
    }),
    
    create: builder.mutation({
      query: ({ structureData, userId }) => ({
        url: `/structures?user=${userId}`,
        method: 'POST',
        body: structureData,
      }),
      invalidatesTags: ['Structure'],
    }),
    
    update: builder.mutation({
      query: ({ id, structureData }) => ({
        url: `/structures/${id}`,
        method: 'PUT',
        body: structureData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Structure', id }],
    }),
    
    delete: builder.mutation({
      query: (id) => ({
        url: `/structures/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Structure', id }],
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
} = structureApi;
export default structureApi;