import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import axios from 'axios';

import EmptyErrorPopup from '../GenericPopup/EmptyErrorPopup';
import { useUser } from '../../common/context/UserContext';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './lobbyPage.scss';

const LobbyPage = () => {
    const { user } = useUser();
    const navigate = useNavigate()

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
                <div className='arrow-back-container'>
                    <ArrowBackIcon className='arrow-back-icon' onClick={() => navigate(-1)} />
                </div>
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
