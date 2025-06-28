import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSignupViewModel } from "./signup-viewmodel";

export default function SignupScreen() {
	const [username, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { handleSubmit } = useSignupViewModel({ email, password, username });

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
							setEmail(e.target.value);
						}}
						value={email}
						className="h-8 focus:outline-red-400  placeholder:text-red-300"
						type="email"
						placeholder=" E-mail"
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
						className=" bg-red-600 text-regal-white h-8 rounded-md "
						type="button"
					>
						Register
					</button>
				</div>
				<Link to="/login" className="pt-5 underline">
					Already an user? Click here to Signin
				</Link>
			</div>
		</div>
	);
}
