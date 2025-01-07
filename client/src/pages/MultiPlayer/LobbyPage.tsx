import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import EmptyErrorPopup from '../GenericPopup/EmptyErrorPopup';
import InvitationPopup from '../GenericPopup/InvitationPopup';

import { useUser } from '../../common/context/userContext';
import { useGame } from '../../common/context/GameContext';
import { useSocket } from '../../common/context/socketContext';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './lobbyPage.scss';

const LobbyPage = () => {
    const socket = useSocket();
    const { user } = useUser();
    const { gameId } = useGame();
    const navigate = useNavigate()

    const [emptyErrorPopup, setEmptyErrorPopup] = useState<boolean>(false)
    const [popupJoinRoom, setPopupJoinRoom] = useState(false);
    const [rivalUsername, setRivalUsername] = useState('');

    socket?.on('invitation-for-game', () => {
        setPopupJoinRoom(true);
    });

    const invitePlayer = async () => {
        if (!rivalUsername.trim()) {
            setEmptyErrorPopup(true)
            return;
        }
        if (rivalUsername === user?.name) return;
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
            {
                popupJoinRoom &&
                <InvitationPopup gameId={gameId} setPopUp={setPopupJoinRoom} />
            }
        </>
    );
};

export default LobbyPage;
