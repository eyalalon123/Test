import React from 'react';

import axios from 'axios';

import { useUser } from '../../common/context/UserContext';
import { useGame } from '../../common/context/GameContext';

import './invitationPopup.scss';

interface InvitationPopupProps {
    setPopUp: React.Dispatch<React.SetStateAction<boolean>>;
    gameId: string | undefined;
}

export const InvitationPopup: React.FC<InvitationPopupProps> = ({ setPopUp, gameId }) => {
    const { user } = useUser();
    const { opponentName } = useGame()

    const handleStartGame = () => {
        if (!user || !gameId) return;
        setPopUp(false);
        try {
            axios.post('/api/game-room/join-game', {
                playerId: user._id,
                gameId
            })
        }
        catch (err) {
            console.log('err: ', err);
        }
    }

    return (
        <div className="invitation-popup-overlay" onClick={() => setPopUp(false)}>
            <div className="invitation-popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-container">
                    <p>{opponentName}</p>
                    <p>הזמין אותך למשחק</p>
                    <button className="confirm-invitation-button" onClick={handleStartGame}>אישור</button>
                    <button className="cancel-invitation-button" onClick={() => setPopUp(false)}>ביטול</button>
                </div>
            </div>
        </div>
    );
};

export default InvitationPopup;
