import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import useLoginViewModel from "./login-viewmodel";

export default function LoginScreen() {
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");

	const { handleSubmit, loading } = useLoginViewModel({ password, username });

	if (loading) {
		return (
			<div className="flex flex-col justify-center items-center w-[100vw] h-[100vh]  ">
				Loading...
			</div>
		);
	}

	return (
		<div>
			<Toaster position="top-center" reverseOrder={false} />
			<div className=" min-h-screen flex flex-col items-center justify-center ">
				<div className="flex flex-col gap-3 w-96 p-5 shadow border border-grey-300 ">
					<h1 className=" text-red-600 text-center text-xl">25NOW</h1>
					<input
						onChange={(e) => {
							setUserName(e.target.value);
						}}
						value={username}
						className="h-8 focus:outline-red-400 placeholder:text-red-300 "
						placeholder=" Username"
					/>
					<input
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						value={password}
						className="h-8 focus:outline-red-400  placeholder:text-red-300"
						type="password"
						placeholder=" Password"
					/>
					<button
						onClick={handleSubmit}
						onKeyDown={(e) => (e.key === "Enter" ? handleSubmit() : "")}
						type="button"
						className=" bg-red-600 text-regal-white h-8 rounded-md "
					>
						Login
					</button>
				</div>
				<Link to="/register" className="pt-5 underline">
					Not yet Registered? Click here to Signup
				</Link>
			</div>
		</div>
	);
}
