import * as React from "react";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import RegisterPage from "./pages/Home/RegisterPage";
import Login from "./pages/Login/Login"
import Page_404 from "./pages/404-Page/404";

import "./App.scss"

export const router = createBrowserRouter(
  createRoutesFromElements(
    [
      <Route path="/" element={<Navigate replace to="/login" />} />,
      <Route path="/*" element={<Page_404 />} />,
      <Route path="/login" element={<Login />} />,
      <Route path="/users" element={<RegisterPage />} />,
    ],
  ),
);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;