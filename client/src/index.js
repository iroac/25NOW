import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./ui/home/home-screen";
import ErrorPage from "./ui/layout/error";
import ProtectRoute from "./ui/layout/routes/ProtectRoute";
import PublicRoute from "./ui/layout/routes/PublicRoute";
import LoginScreen from "./ui/login/login-screen";
import SignupScreen from "./ui/signup/signup-screen";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<ProtectRoute>
				<App />
			</ProtectRoute>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: "/login",
		element: (
			<PublicRoute>
				<LoginScreen />
			</PublicRoute>
		),
	},
	{
		path: "/register",
		element: (
			<PublicRoute>
				<SignupScreen />
			</PublicRoute>
		),
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
