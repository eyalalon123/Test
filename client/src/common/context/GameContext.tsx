import React, { createContext, useContext, useState } from "react";

interface GameIdContext {
    gameId: string | undefined,
    setGameId: (id: string) => void;
}

const GameContext = createContext<GameIdContext | null>(null);

export const useGame = () => {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("A user context provider is missing, can't use context");
    return ctx;
}

const GameProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [gameId, setGameId] = useState<string>();

    return (
        <GameContext.Provider value={{ gameId, setGameId: (id: string) => setGameId(id) }}>
            {children}
        </GameContext.Provider>
    )
}
export default GameProvider;