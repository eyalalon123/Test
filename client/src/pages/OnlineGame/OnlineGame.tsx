import { useState } from 'react';

import axios from 'axios';

import { useSocket } from '../../common/context/socketContext';
import { useUser } from '../../common/context/userContext';
import TwoPlayer from '../Game/TwoPlayer';

import './onlineGame.scss';

const OnlineGame = () => {
    const { user } = useUser();
    const socket = useSocket();
    const [gameStarted, setGameStarted] = useState(false);
    const [rivalUsername, setRivalUsername] = useState('');

    const invitePlayer = async () => {
        if (!rivalUsername.trim()) {
            console.log('שם המשתמש לא יכול להיות ריק');
            return;
        }
        try {
            await axios.post('/api/game-room', {
                playerId: user?._id,
                opponentName: rivalUsername
            })
        }
        catch (err) {
            console.log('err: ', err);
        }
    };

    socket?.on('start-game', () => {
        setGameStarted(true);
    })

    return (
        <>
            {
                !gameStarted ?
                    <div className="online-game">
                        <div className="join-game">
                            <h4 className="create-game">צור משחק</h4>
                            <input
                                className="rival-input"
                                value={rivalUsername}
                                onChange={(e) => setRivalUsername(e.target.value)}
                                placeholder="שם משתמש של יריב"
                            />
                            <button className="join-game-button" onClick={invitePlayer}>הצטרף / התחל משחק</button>
                        </div>
                    </div>
                    :
                    <TwoPlayer />
            }
        </>
    );
};

export default OnlineGame;
