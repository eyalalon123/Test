import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSocket } from '../../common/context/socketContext';
import InvitationPopup from '../GenericPopup/InvitationPopup';
import { useUser } from '../../common/context/userContext';
import TwoPlayer from '../Game/TwoPlayer';

import "./homePage.scss"

const HomePage = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const [gameStarted, setGameStarted] = useState(false);
    const [popupJoinRoom, setPopupJoinRoom] = useState(false);
    const [gameId, setGameId] = useState<string>();

    const handleGame = () => {
        navigate('/game')
    }

    socket?.on('invitation-for-game', (gameId) => {
        setGameId(gameId);
        setPopupJoinRoom(true);
    });

    socket?.on('start-game', () => {
        setGameStarted(true);
    });

    if (!user) return <div>Loading...</div>;
    return (
        <>
            {gameStarted ?
                <TwoPlayer /> :
                <>
                    <div className="home-page">
                        <div className="data-container">
                            <h2>Welcome to the Home Page {user.name}</h2>
                            <button className='start-game-button' onClick={handleGame}>התחל משחק יחיד</button>
                            <button className='start-game-button' onClick={() => navigate('/online-game')}>שחק עם חבר</button>
                            <button className='start-game-button' onClick={() => console.log("gg")}>טבלת ניקוד</button>
                            <button className='start-game-button' onClick={logout}>התנתק</button>
                        </div>
                    </div>
                    {popupJoinRoom &&
                        <InvitationPopup gameId={gameId} setPopUp={setPopupJoinRoom} />}
                </>

            }
        </>
    );
};

export default HomePage;
