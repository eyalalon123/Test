import axios from 'axios';
import { useState } from 'react';
import { useUser } from '../../common/context/userContext';
import TwoPlayer from '../Game/TwoPlayer';

import './onlineGame.scss';

const OnlineGame = () => {
    const [rivalUsername, setRivalUsername] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const { user } = useUser();

    const joinGame = async () => {
        if (!rivalUsername.trim()) {
            console.log('שם המשתמש לא יכול להיות ריק');
            return;
        }
        try {
            const data = await axios.post('/api/game-room', {
                playerId: user?._id,
                opponentName: rivalUsername
            })
            console.log('data: ', data);
        }
        catch (err) {
            console.log('err: ', err);
        }
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
