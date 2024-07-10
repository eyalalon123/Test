import { createContext, useContext, useEffect, useState } from "react";

import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

const CreateSocketConnectionContext = createContext<{
    createSocketConnection: (id?: string) => Socket | null | undefined
} | null>(null);

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error("A context provider is missing, can't use context");
    return ctx;
}

export const useCreateSocketConnection = () => {
    const ctx = useContext(CreateSocketConnectionContext);
    if (!ctx) throw new Error("A context provider is missing, can't use context");
    return ctx;
}

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [socket, setSocket] = useState<Socket | null>(null);
    const [userId, setUserId] = useState<string>();

    useEffect(() => {
        if (socket && userId) joinRoom()
    }, [socket, userId])

    const createSocketConnection = (id?: string) => {
        try {
            if (id) setUserId(id)
            const domain = "http://localhost:8000";
            if (!domain) return;

            const socket = io(domain);
            setSocket(socket);
            console.log("Socket created successfully");
            return socket;
        }
        catch (err) {
            console.log(err);
        }
    }

    const joinRoom = () => {
        if (!socket) return;
        socket.on('connect', () => {
            // Join a room
            socket.emit('joinRoom', `room-${userId}`);
        })
        console.log(`Joined into room-${userId}`);
    }

    return (
        <SocketContext.Provider value={socket}>
            <CreateSocketConnectionContext.Provider value={{ createSocketConnection }}>
                {children}
            </CreateSocketConnectionContext.Provider>
        </SocketContext.Provider>
    )
}
export default SocketProvider;
