import axios from "axios";
import axiosInstance from "./client";

const API_URL = import.meta.env.VITE_API_URL;

export const SignInUser = async (userEmail: string, userPassword: string) => {
	try {
		const response = await axiosInstance.post(`/api/v1/auth/login`, {
			email: userEmail,
			password: userPassword,
		});

		const { user, accessToken, message } = response.data;


		if (accessToken) localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('user', JSON.stringify(user));

		return { user, accessToken, message };
	} catch (e) {
		console.error("SignInUser failed:", e);
		throw e;
	}
};

export const SignUpUser = async (data: {
	username: string;
	email: string;
	password: string;
	phone_number?: string;
}) => {
	try {
		const response = await axiosInstance.post(`/api/v1/auth/register`, data);
		const { accessToken, user } = response.data || {};
		if (accessToken) localStorage.setItem('accessToken', accessToken);
		if (user) localStorage.setItem('user', JSON.stringify(user));
		return response.data;
	} catch (e) {
		console.error(e);
		throw e;
	}
};

export const Logout = async () => {
  try {
		// call backend to revoke refresh token stored in HttpOnly cookie
			await axiosInstance.post(`/api/v1/auth/logout`, {});
  } catch (e) {
    console.warn('Logout request failed (ignoring):', e);
  } finally {
    // clear client storage regardless
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};
