import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";

interface GameIdContext {
    gameId: string | undefined,
    chosenLetter: string | undefined;
    gameStatus: GameStatusEnum | undefined;
    opponentId: string | undefined;
    isNewRound: boolean;
    showEndGamePopup: boolean;
    results: boolean[];
    timeLeft: number;
    inputs: any[];
}

export enum GameStatusEnum {
    Pending = "PENDING",
    InProgress = "IN_PROGRESS",
    GameOver = "GAME_OVER"
}

const GameContext = createContext<GameIdContext | null>(null);

export const useGame = () => {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("A user context provider is missing, can't use context");
    return ctx;
}

const GameProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const socket = useSocket();
    const navigate = useNavigate();
    const [gameId, setGameId] = useState<string>();
    const [chosenLetter, setChosenLetter] = useState<string>();
    const [gameStatus, setGameStatus] = useState<GameStatusEnum>();
    const [opponentId, setOpponentId] = useState<string>();
    const [isNewRound, setIsNewRound] = useState<boolean>(false);
    const [showEndGamePopup, setShowEndGamePopup] = useState(false);
    const [results, setResults] = useState<boolean[]>([]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()
    const [inputs, setInputs] = useState(Array(9).fill(''));

    useEffect(() => {
        if (timeLeft === 0) {
            setTimeLeft(60);
            clearInterval(intervalId);
        }
    }, [timeLeft])

    useEffect(() => {
        if (!socket) return;

        socket.on('start-game', ({ randomLetter, gameId, opponentId }) => {
            setGameStatus(GameStatusEnum.InProgress);
            setChosenLetter(randomLetter)
            setGameId(gameId);
            navigate('/multi-player');
            setShowEndGamePopup(false)
            setResults([])
            setInputs(Array(9).fill(''))
            setOpponentId(opponentId);
            startTimer();
            setIsNewRound(false);
        })

        socket.on('invitation-for-game', ({ gameId: inviteGameId }) => {
            if (inviteGameId === gameId) {
                setIsNewRound(true);
            }
            else setGameId(inviteGameId);
        });
        return () => {
            socket.off('start-game');
        };
    }, [socket]);

    const startTimer = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setTimeLeft(60);
        }

        const interval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        setIntervalId(interval)
    }

    socket?.on('end-game', () => {
        clearInterval(intervalId);
        setShowEndGamePopup(true)
    })

    return (
        <GameContext.Provider value={{ results, inputs, timeLeft, gameId, showEndGamePopup, isNewRound, opponentId, chosenLetter, gameStatus }}>
            {children}
        </GameContext.Provider>
    )
}
export default GameProvider;