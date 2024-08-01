import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../common/context/GameContext';

import { useUser } from '../../common/context/UserContext';
import { useSocket } from '../../common/context/SocketContext';

import InvitationPopup from '../GenericPopup/InvitationPopup';

import "./homePage.scss"

const HomePage = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const { gameId } = useGame();
    const socket = useSocket();

    const [popupJoinRoom, setPopupJoinRoom] = useState(false);

    const handleGame = () => {
        navigate('/single-player')
    }

    socket?.on('invitation-for-game', () => {
        setPopupJoinRoom(true);
    });

    if (!user) return <div>Loading...</div>;

    return (
        <>
            <div className="home-page">
                <div className="data-container">
                    <h2>Welcome to the Home Page {user.name}</h2>
                    <button className='start-game-button' onClick={handleGame}>התחל משחק יחיד</button>
                    <button className='start-game-button' onClick={() => navigate('/lobby')}>שחק עם חבר</button>
                    <button className='start-game-button' onClick={() => navigate('/score-table')}>טבלת ניקוד</button>
                    <button className='start-game-button' onClick={logout}>התנתק</button>
                </div>
            </div>
            {popupJoinRoom &&
                <InvitationPopup gameId={gameId} setPopUp={setPopupJoinRoom} />
            }

        </>
    );
};

export default HomePage;
