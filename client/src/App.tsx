import * as React from "react";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./Home/Home";

import Login from "./Login/Login"

import "./App.scss"

export const router = createBrowserRouter(
  createRoutesFromElements(
    [
      <Route path="/" element={<Navigate replace to="/login" />} />,
      <Route path="/login" element={<Login />} />,
      <Route path="/users" element={<Home />} />,
    ],
  ),
);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;