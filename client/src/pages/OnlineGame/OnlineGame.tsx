import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import TwoPlayer from '../Game/TwoPlayer';

import './onlineGame.scss';

const socket = io('http://localhost:8000', {
    withCredentials: true,
});

const OnlineGame = () => {
    const [rivalUsername, setRivalUsername] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('gameStarted', ({ opponent }) => {
            console.log(`Game started with opponent: ${opponent}`);
            setGameStarted(true);
        });

        socket.on('gameEnded', () => {
            console.log('Game ended');
            setGameStarted(false);
            navigate('/home')
        });

        socket.on('joinError', ({ error }) => {
            console.log(error);
        });

        return () => {
            socket.off('connect');
            socket.off('gameStarted');
            socket.off('timer');
            socket.off('gameEnded');
            socket.off('joinError');
            socket.off('disconnect');
        };
    }, []);

    const joinGame = () => {
        if (!rivalUsername.trim()) {
            console.log('שם המשתמש לא יכול להיות ריק');
            return;
        }

        socket.emit('joinGame', { username: rivalUsername });
    };

    return (
        <div className="online-game">
            {!gameStarted && (
                <div className="join-game">
                    <h4 className="create-game">צור משחק</h4>
                    <input
                        className="rival-input"
                        value={rivalUsername}
                        onChange={(e) => setRivalUsername(e.target.value)}
                        placeholder="שם משתמש של יריב"
                    />
                    <button className="join-game-button" onClick={joinGame}>הצטרף / התחל משחק</button>
                </div>
            )}
            {gameStarted && <TwoPlayer />}
        </div>
    );
};

export default OnlineGame;
