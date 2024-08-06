import React from 'react';

import { useGame } from '../../common/context/GameContext';

import './endGamePopup.scss';

interface EndGameProps {
    handleInviteNewGame: () => void;
    handleStartNewGame: () => void;
    handleUserGoBackHome: () => void;
    showResults: () => void;
}

export const EndGamePopUp: React.FC<EndGameProps> = ({ handleInviteNewGame, handleStartNewGame, handleUserGoBackHome, showResults }) => {
    const { isNewRound, scoreP1, scoreP2, opponentName, createdName } = useGame()

    return (
        <div className="end-game-popup-overlay">
            <div className="end-game-popup">
                <div className="end-game-container">
                    <div>{scoreP1 === scoreP2 ? 'המשחק נגמר בתיקו' : scoreP1 > scoreP2 ? `${createdName} ניצח את הסיבוב הזה` : scoreP2 > scoreP1 ? `${opponentName} ניצח את הסיבוב הזה` : ''}</div>
                    <p>{createdName}: {scoreP1}</p>
                    <p>{opponentName}: {scoreP2}</p>
                    {isNewRound ?
                        <button className="invitation-game-button" onClick={handleStartNewGame}>הוזמנת למשחק חדש לחץ כאן לאישור</button>
                        :
                        <>

                            <button className="invitation-game-button" onClick={showResults}>צפה בתשובות</button>
                            <button className="end-game-button" onClick={handleInviteNewGame}>הזמן למשחק נוסף</button>
                        </>
                    }
                    <button className="end-game-button" onClick={handleUserGoBackHome}>חזרה לעמוד הבית</button>
                </div>
            </div>
        </div >
    );
};

export default EndGamePopUp;
