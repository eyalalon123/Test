import { useState } from 'react';

import axios from 'axios';

import { useUser } from '../../common/context/UserContext';

import './lobbyPage.scss';

const LobbyPage = () => {
    const { user } = useUser();

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

    return (
        <div className="online-game">
            <div className="join-game">
                <h4 className="create-game">צור משחק</h4>
                <input
                    className="rival-input"
                    value={rivalUsername}
                    onChange={(e) => setRivalUsername(e.target.value)}
                    placeholder="שם משתמש של יריב"
                />
                <button className="join-game-button" onClick={invitePlayer}>הזמן למשחק</button>
            </div>
        </div>
    );
};

export default LobbyPage;
