import React from 'react';

import './InvitationPopup.scss';

interface InvitationPopupProps {
    setPopUp: React.Dispatch<React.SetStateAction<boolean>>;
    setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InvitationPopup: React.FC<InvitationPopupProps> = ({ setPopUp, setGameStarted }) => {

    const handleMoveToGame = () => {
        setGameStarted(true)
        setPopUp(false)
    }
    return (
        <div className="invitation-popup-overlay" onClick={() => setPopUp(false)}>
            <div className="invitation-popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-container">
                    <p>הזמינו אותך למשחק</p>
                    <button className="confirm-invitation-button" onClick={handleMoveToGame}>אישור</button>
                    <button className="cancel-invitation-button" onClick={() => setPopUp(false)}>ביטול</button>
                </div>
            </div>
        </div>
    );
};

export default InvitationPopup;
