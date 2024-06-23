import * as React from "react";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home/Home";

import Login from "./pages/Login/Login"

import "./App.scss"
import Page_404 from "./pages/404-Page/404";

export const router = createBrowserRouter(
  createRoutesFromElements(
    [
      <Route path="/" element={<Navigate replace to="/login" />} />,
      <Route path="/*" element={<Page_404 />} />,
      <Route path="/login" element={<Login />} />,
      <Route path="/users" element={<Home />} />,
    ],
  ),
);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;