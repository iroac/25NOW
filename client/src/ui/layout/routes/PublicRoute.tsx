import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios-config";

function PublicRoute({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	const [user, setUser] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			const res = await api.get("api/getuser", { withCredentials: true });

			if (res.data.username) {
				navigate("/");
			} else {
				setUser(true);
			}
		};

		fetchUser();
	});

	return <div>{user && <div>{children}</div>}</div>;
}

export default PublicRoute;
