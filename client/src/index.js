import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import axios from 'axios';
import ErrorPage from './components/ErrorPage';
import Login from './components/Login';
import Register from './components/Register';
import ProtectRoute from './components/ProtectRoute';
import PublicRoute from './components/PublicRoute';

axios.defaults.baseURL = 'https://two5now-api.onrender.com';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectRoute> <App /> </ProtectRoute>,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <PublicRoute> <Login /> </PublicRoute>
  },
  {
    path: "/register",
    element: <PublicRoute> <Register /> </PublicRoute>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

