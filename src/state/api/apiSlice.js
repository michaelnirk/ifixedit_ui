import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base query with auth token handling
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

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		// Auth endpoints
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
		})
	}),
	reducerPath: 'api',
	tagTypes: ['User']
});

// Export hooks for usage in functional components
export const { useLoginMutation, useLogoutMutation } = apiSlice;
export default apiSlice;
