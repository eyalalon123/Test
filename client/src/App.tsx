import * as React from "react";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import ContextManager from "./common/ContextManager";

import RegisterPage from "./pages/Register/RegisterPage";
import ScoreTable from "./pages/ScoreTable/ScoreTable";
import LobbyPage from "./pages/MultiPlayer/LobbyPage";
import SinglePlayer from "./pages/Game/SinglePlayer";
import MultiPlayer from "./pages/Game/MultiPlayer";
import HomePage from "./pages/Home/HomePage";
import Page_404 from "./pages/404-Page/404";
import Login from "./pages/Login/Login"

import "./App.scss"

export const router = createBrowserRouter(
  createRoutesFromElements(
    [
      <Route path="/" element={<Navigate replace to="/login" />} />,
      <Route path="/*" element={<Page_404 />} />,
      <Route path="/login" element={<Login />} />,
      <Route path="/register" element={<RegisterPage />} />,
      <Route path="/score-table" element={<ScoreTable />} />,

      <Route element={<ContextManager />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/single-player" element={<SinglePlayer />} />
        <Route path="/multi-player" element={<MultiPlayer />} />
        <Route path="/lobby" element={<LobbyPage />} />
      </Route>,
    ],
  ),
);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
}
export default App;