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

export const currenciesApi = createApi({
  reducerPath: 'currenciesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Currency'],
  endpoints: (builder) => ({
    // Currency endpoints
    list: builder.query({
      query: (userId) => {
        if (!userId) {
          throw new Error('User ID is required');
        }
        return `/${userId}/currencies`;
      },
      providesTags: ['Currency'],
    })
  }),
  selectors: {}
});

// Export hooks for usage in functional components
export const { useListQuery } = currenciesApi;
export const { list } = currenciesApi.endpoints;
export default currenciesApi;