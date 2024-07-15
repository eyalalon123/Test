import React from 'react';
import { useNavigate } from 'react-router-dom';

import './endGamePopup.scss';

interface EndGameProps {
    setEndGamePopUp: React.Dispatch<React.SetStateAction<boolean>>;
    text: string;
    handleStartNewGame?: () => void;
}

export const EndGamePopUp: React.FC<EndGameProps> = ({ setEndGamePopUp, text, handleStartNewGame }) => {

    const navigate = useNavigate()

    return (
        <div className="end-game-popup-overlay" onClick={() => setEndGamePopUp(false)}>
            <div className="end-game-popup" onClick={(e) => e.stopPropagation()}>
                <div className="end-game-container">
                    <p>מישהו ניצח</p>
                    <button className="end-game-button" onClick={handleStartNewGame}>{text}</button>
                    <button className="end-game-button" onClick={() => navigate('/home')}>חזרה לעמוד הבית</button>
                </div>
            </div>
        </div>
    );
};

export default EndGamePopUp;
