import React from 'react';
import { useGame } from '../../common/context/GameContext';

import './endGamePopup.scss';

interface EndGameProps {
    scoreP1: number;
    scoreP2: number;
    handleInviteNewGame: () => void;
    handleStartNewGame: () => void;
    handleUserGoBackHome: () => void;
}

export const EndGamePopUp: React.FC<EndGameProps> = ({ scoreP1, scoreP2, handleInviteNewGame, handleStartNewGame, handleUserGoBackHome }) => {
    const { isNewRound } = useGame()

    return (
        <div className="end-game-popup-overlay">
            <div className="end-game-popup">
                <div className="end-game-container">
                    <div>{scoreP1 === scoreP2 ? 'המשחק נגמר בתיקו' : scoreP1 > scoreP2 ? '' : scoreP2 > scoreP1 ? '' : ''}</div>
                    <p>{scoreP2}</p>
                    <p>{scoreP1}</p>
                    {isNewRound ?
                        <button className="invitation-game-button" onClick={handleStartNewGame}>הוזמנת למשחק חדש לחץ כאן לאישור</button>
                        :
                        <button className="end-game-button" onClick={handleInviteNewGame}>הזמן למשחק נוסף</button>
                    }
                    <button className="end-game-button" onClick={handleUserGoBackHome}>חזרה לעמוד הבית</button>
                </div>
            </div>
        </div >
    );
};

export default EndGamePopUp;
