import { createContext, useContext, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./userContext";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

const SocketProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();

    const createSocketConnection = useMemo(() => {
        if (!user) return null;

        const serverIp = "10.0.0.27";
        const domain = `http://${serverIp}:8000`;

        try {
            const newSocket = io(domain, {
                transports: ['websocket'],
                withCredentials: true,
            });

            newSocket.on('connect', () => {
                console.log("Socket created successfully");
                joinRoom(newSocket);
            });

            newSocket.on('disconnect', () => {
                console.log("Socket disconnected");
            });

            return newSocket;
        } catch (err) {
            console.log(err);
            return null;
        }
    }, [user]);

    useEffect(() => {
        function handleUnload() {
            createSocketConnection?.disconnect();
        }

        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        }
    }, [createSocketConnection]);

    const joinRoom = (socket: Socket) => {
        if (!socket || !user) return;
        socket.emit('joinRoom', `room-${user._id}`);
        console.log(`Joined into room-${user._id}`);
    }

    if (!createSocketConnection) return <span>Error</span>;

    return (
        <SocketContext.Provider value={createSocketConnection}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;
