import axios from "axios";

export const api = axios.create({
	baseURL:
		process.NODE_ENV === "production"
			? process.env.REACT_APP_API_URL
			: process.env.REACT_APP_DEV_URL,
	timeout: 5000,
});
