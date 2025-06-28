import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/axios-config";

type PropsUseLoginViewModel = { username: string; password: string };

export default function useLoginViewModel({
	username,
	password,
}: PropsUseLoginViewModel) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const res = await api.post(
				"api/login",
				{ username, password },
				{ withCredentials: true },
			);
			if (res) {
				navigate("/");
			}
		} catch (e) {
			toast.error(e.response.data);
		} finally {
			setLoading(false);
		}
	};

	return { handleSubmit, loading };
}
