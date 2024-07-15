import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSocket } from '../../common/context/socketContext';
import { useUser } from '../../common/context/userContext';

import MultiPlayer from '../Game/MultiPlayer';
import InvitationPopup from '../GenericPopup/InvitationPopup';

import "./homePage.scss"

const HomePage = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const socket = useSocket();

    const [popupJoinRoom, setPopupJoinRoom] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [chosenLetter, setChosenLetter] = useState('');
    const [, setShowEndGamePopup] = useState(false);
    const [gameId, setGameId] = useState<string>();

    const handleGame = () => {
        navigate('/single-player')
    }

    socket?.on('invitation-for-game', (gameId) => {
        setGameId(gameId);
        setPopupJoinRoom(true);
    });

    socket?.on('start-game', ({ gameId, randomLetter }) => {
        setChosenLetter(randomLetter)
        setGameId(gameId);
        setGameStarted(true);
    });

    if (!user) return <div>Loading...</div>;
    return (
        <>
            {gameStarted ?
                <MultiPlayer setEndGamePopUp={setShowEndGamePopup} text='המתן להתחלת סיבוב חדש על ידי המשתמש הראשי' chosenLetter={chosenLetter} /> :
                <>
                    <div className="home-page">
                        <div className="data-container">
                            <h2>Welcome to the Home Page {user.name}</h2>
                            <button className='start-game-button' onClick={handleGame}>התחל משחק יחיד</button>
                            <button className='start-game-button' onClick={() => navigate('/lobby')}>שחק עם חבר</button>
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
