import { createContext, useContext, useEffect, useMemo } from "react";

import { io, Socket } from "socket.io-client";
import { useUser } from "./UserContext";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

const SocketProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {

    const { user } = useUser();
    const socket = useMemo<Socket | null>(createSocketConnection, [user]);

    useEffect(() => {
        function handleUnload() {
            socket?.disconnect()
        }

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload)
        }
    }, [])

    function createSocketConnection() {
        if (!user) return null;
        try {
            const domain = "http://localhost:8000";
            const newSocket = io(domain);

            newSocket.on('connect', () => {
                console.log("Socket created successfully");
                joinRoom(newSocket);
            })

            newSocket.on('disconnect', () => {
                console.log("Socket disconnected");
            })

            return newSocket;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    const joinRoom = (socket: Socket) => {
        if (!socket || !user) return;
        socket.emit('joinRoom', `room-${user._id}`);
        console.log(`Joined into room-${user._id}`);
    }

    if (!socket) return <span>Error</span>;

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
export default SocketProvider;
