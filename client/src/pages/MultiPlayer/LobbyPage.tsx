import { useState } from 'react';

import axios from 'axios';

import { useUser } from '../../common/context/UserContext';

import './lobbyPage.scss';
import EmptyErrorPopup from '../GenericPopup/EmptyErrorPopup';

const LobbyPage = () => {
    const { user } = useUser();

    const [emptyErrorPopup, setEmptyErrorPopup] = useState<boolean>(false)
    const [rivalUsername, setRivalUsername] = useState('');

    const invitePlayer = async () => {
        if (!rivalUsername.trim()) {
            setEmptyErrorPopup(true)
            return;
        }
        try {
            await axios.post('/api/game-room', {
                playerId: user?._id,
                opponentName: rivalUsername
            })
        }
        catch (err) {
            setEmptyErrorPopup(true)
            console.log('err: ', err);
        }
    };

    return (
        <>
            {emptyErrorPopup && <EmptyErrorPopup setEmptyErrorPopUp={setEmptyErrorPopup} />}
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
        </>
    );
};

export default LobbyPage;
