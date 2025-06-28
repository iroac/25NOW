import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useSignupViewModel({
	email,
	username,
	password,
}: { email: string; username: string; password: string }) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const res = await axios.post(
				"https://two5now-api.onrender.com/api/register",
				{ email, username, password },
				{ withCredentials: true },
			); // enable cookies and sessions across domains
			toast.success(res.data);
			navigate("/login");
		} catch (e) {
			toast.error(e.response.data);
		} finally {
			setLoading(true);
		}
	};

	return { handleSubmit, loading };
}
