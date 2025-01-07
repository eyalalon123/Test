import { Outlet } from "react-router-dom";

import SocketProvider from "./context/socketContext";
import GameProvider from "./context/GameContext";

const ContextManager: React.FC = () => {

    return (
        <SocketProvider>
            <GameProvider>
                <Outlet />
            </GameProvider>
        </SocketProvider>
    )
}
export default ContextManager;
