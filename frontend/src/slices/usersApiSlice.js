import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/api/auth/login/",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=&username=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(
          password
        )}&scope=&client_id=&client_secret=`,
      }),
    }),
  }),
});

export const { useLoginMutation } = userApiSlice;
