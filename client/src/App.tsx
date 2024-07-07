import * as React from "react";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Login from "./pages/Login/Login"
import RegisterPage from "./pages/Register/RegisterPage";
import HomePage from "./pages/Home/HomePage";
import Page_404 from "./pages/404-Page/404";
import GamePage from "./pages/Game/game";
import OnlineGame from "./pages/OnlineGame/OnlineGame";

import "./App.scss"


export const router = createBrowserRouter(
  createRoutesFromElements(
    [
      <Route path="/" element={<Navigate replace to="/login" />} />,
      <Route path="/*" element={<Page_404 />} />,
      <Route path="/login" element={<Login />} />,
      <Route path="/register" element={<RegisterPage />} />,
      <Route path="/home" element={<HomePage />} />,
      <Route path="/game" element={<GamePage />} />,
      <Route path="/online-game" element={<OnlineGame />} />,
    ],
  ),
);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
}
export default App;