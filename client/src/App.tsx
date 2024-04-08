import * as React from "react";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Login from "./Login/Login"

export const router = createBrowserRouter(
  createRoutesFromElements(
    [
      <Route path="/" element={<Navigate replace to="/login" />} />,
      <Route path="/login" element={<Login />} />,
    ],
  ),
);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;