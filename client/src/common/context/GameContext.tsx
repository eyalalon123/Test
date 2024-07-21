import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";

interface GameIdContext {
    gameId: string | undefined;
    chosenLetter: string | undefined;
    gameStatus: GameStatusEnum | undefined;
    opponentId: string | undefined;
    isNewRound: boolean;
    showEndGamePopup: boolean;
    timeLeft: number;
    startGame: (randomLetter: string, gameId: string, opponentId: string) => void;
    scoreP1: number;
    scoreP2: number;
    results: boolean[];
    setResults: React.Dispatch<React.SetStateAction<boolean[]>>;
    opponentName: string;
    createdName: string;
    inputs: any[];
    setInputs: React.Dispatch<React.SetStateAction<any[]>>;
    pointResults: number;
    setPointResults: React.Dispatch<React.SetStateAction<number>>;
}

export enum GameStatusEnum {
    Pending = "PENDING",
    InProgress = "IN_PROGRESS",
    GameOver = "GAME_OVER",
}

const GameContext = createContext<GameIdContext | null>(null);

export const useGame = () => {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("A game context provider is missing, can't use context");
    return ctx;
};

const GameProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const socket = useSocket();
    const navigate = useNavigate();
    const [gameId, setGameId] = useState<string>();
    const [chosenLetter, setChosenLetter] = useState<string>();
    const [gameStatus, setGameStatus] = useState<GameStatusEnum>();
    const [opponentId, setOpponentId] = useState<string>();
    const [isNewRound, setIsNewRound] = useState<boolean>(false);
    const [showEndGamePopup, setShowEndGamePopup] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
    const [scoreP1, setScoreP1] = useState(0);
    const [scoreP2, setScoreP2] = useState(0);
    const [results, setResults] = useState<boolean[]>([]);
    const [opponentName, setOpponentName] = useState<string>('');
    const [createdName, setCreatedName] = useState<string>('');
    const [inputs, setInputs] = useState(Array(9).fill(''));
    const [pointResults, setPointResults] = useState<number>(0);

    useEffect(() => {
        if (timeLeft === 0) {
            setTimeLeft(60);
            clearInterval(intervalId);
        }
    }, [timeLeft, intervalId]);

    useEffect(() => {
        if (!socket) return;

        const handleStartGame = ({ randomLetter, gameId, opponentId }: any) => {
            navigate('/multi-player');
            startGame(randomLetter, gameId, opponentId);
        };

        const handleInvitationForGame = ({ gameId: inviteGameId, createdName }: any) => {
            if (inviteGameId === gameId) {
                setOpponentName(createdName)
                setIsNewRound(true);
            } else {
                setOpponentName(createdName)
                setGameId(inviteGameId);
            }
        };

        const handleEndGame = ({ resultsP1, resultsP2, createdName, invitedName }: any) => {
            setCreatedName(createdName)
            setOpponentName(invitedName)
            clearInterval(intervalId);
            setShowEndGamePopup(true);
            setScoreP1(resultsP1)
            setScoreP2(resultsP2)
        };

        socket.on('start-game', handleStartGame);
        socket.on('invitation-for-game', handleInvitationForGame);
        socket.on('end-game', handleEndGame);

        return () => {
            socket.off('start-game', handleStartGame);
            socket.off('invitation-for-game', handleInvitationForGame);
            socket.off('end-game', handleEndGame);
        };
    }, [socket, navigate, intervalId, gameId]);

    const startGame = (randomLetter: string, gameId: string, opponentId: string) => {
        setGameStatus(GameStatusEnum.InProgress);
        setChosenLetter(randomLetter);
        setGameId(gameId);
        setShowEndGamePopup(false);
        setOpponentId(opponentId);
        startTimer();
        setResults([])
        setInputs(Array(9).fill(''))
        setScoreP1(0)
        setScoreP2(0)
        setPointResults(0)
        setIsNewRound(false);
    };

    const startTimer = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setTimeLeft(60);
        }

        const interval = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        setIntervalId(interval);
    };

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);

    return (
        <GameContext.Provider value={{ pointResults, setPointResults, setInputs, inputs, createdName, opponentName, setResults, results, scoreP1, scoreP2, startGame, timeLeft, gameId, showEndGamePopup, isNewRound, opponentId, chosenLetter, gameStatus }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;
