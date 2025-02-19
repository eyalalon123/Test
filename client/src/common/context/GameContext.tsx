import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./socketContext";
import { useUser } from "./userContext";

interface GameIdContext {
    gameId: string | undefined;
    chosenLetter: string | undefined;
    gameStatus: GameStatusEnum | undefined;
    opponentId: string | undefined;
    isNewRound: boolean;
    showEndGamePopup: boolean;
    setShowEndGamePopup: React.Dispatch<React.SetStateAction<boolean>>;
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
    showResultsAfterGame: boolean;
    setShowResultsAfterGame: React.Dispatch<React.SetStateAction<boolean>>;
    hasSubmitted: boolean;
    setHasSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    intervalId: NodeJS.Timeout | undefined;
    chat: Message[];
    addMessage: (message: Message) => void;
    newMessage: boolean;
    setNewMessage: React.Dispatch<React.SetStateAction<boolean>>;
    newMessageCount: number;
    updateNewMessageCount: (count: number) => void;
}

export enum GameStatusEnum {
    Pending = "PENDING",
    InProgress = "IN_PROGRESS",
    GameOver = "GAME_OVER",
}

export type Message = {
    senderId: string,
    gameId: string | undefined,
    content: string,
    date: Date
}

const GameContext = createContext<GameIdContext | null>(null);

export const useGame = () => {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("A game context provider is missing, can't use context");
    return ctx;
};

const GameProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const socket = useSocket();
    const { user } = useUser();
    const navigate = useNavigate();

    const [scoreP1, setScoreP1] = useState(0);
    const [scoreP2, setScoreP2] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameId, setGameId] = useState<string>();
    const [chat, setChat] = useState<Message[]>([]);
    const [results, setResults] = useState<boolean[]>([]);
    const [opponentId, setOpponentId] = useState<string>();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [inputs, setInputs] = useState(Array(9).fill(''));
    const [newMessageCount, setNewMessageCount] = useState(0);
    const [chosenLetter, setChosenLetter] = useState<string>();
    const [createdName, setCreatedName] = useState<string>('');
    const [pointResults, setPointResults] = useState<number>(0);
    const [opponentName, setOpponentName] = useState<string>('');
    const [newMessage, setNewMessage] = useState<boolean>(false);
    const [isNewRound, setIsNewRound] = useState<boolean>(false);
    const [gameStatus, setGameStatus] = useState<GameStatusEnum>();
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
    const [showEndGamePopup, setShowEndGamePopup] = useState(false);
    const [showResultsAfterGame, setShowResultsAfterGame] = useState(false);

    useEffect(() => {
        if (timeLeft === 0) {
            setTimeLeft(60);
            clearInterval(intervalId);
        }
    }, [timeLeft, intervalId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('start-game', handleStartGame);
        socket.on('invitation-for-game', handleInvitationForGame);
        socket.on('end-game', handleEndGame);
        socket.on('new-message', handleNewMessage);

        return () => {
            socket.off('start-game', handleStartGame);
            socket.off('invitation-for-game', handleInvitationForGame);
            socket.off('end-game', handleEndGame);
            socket.off('new-message', handleNewMessage);
        };
    }, [socket, navigate, intervalId, gameId]);

    const handleStartGame = ({ randomLetter, gameId, opponentId }: any) => {
        navigate('/multi-player');
        setShowResultsAfterGame(false)
        startGame(randomLetter, gameId, opponentId);
    };

    const handleInvitationForGame = ({ gameId: inviteGameId, createdName }: any) => {
        if (inviteGameId === gameId) {
            setOpponentName(createdName)
            setIsNewRound(true);
            setShowEndGamePopup(true);
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

    const handleNewMessage = (message: Message) => {
        addMessage(message);
        if (message.senderId !== user?._id) {
            setNewMessageCount(prevCount => {
                const newCount = prevCount + 1;
                updateNewMessageCount(newCount);
                return newCount;
            });
        }
    };

    const updateNewMessageCount = (count: number) => {
        setNewMessageCount(count);
        setNewMessage(count > 0);
    };

    const addMessage = (message: Message) => {
        setChat(prev => {
            const chat: Message[] = JSON.parse(JSON.stringify(prev))
            chat.push(message);
            return chat;
        })
    }


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
        setHasSubmitted(false)
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
        <GameContext.Provider value={{ updateNewMessageCount, newMessageCount, newMessage, setNewMessage, addMessage, chat, intervalId, hasSubmitted, setHasSubmitted, pointResults, setShowResultsAfterGame, showResultsAfterGame, setShowEndGamePopup, setPointResults, setInputs, inputs, createdName, opponentName, setResults, results, scoreP1, scoreP2, startGame, timeLeft, gameId, showEndGamePopup, isNewRound, opponentId, chosenLetter, gameStatus }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameProvider;
