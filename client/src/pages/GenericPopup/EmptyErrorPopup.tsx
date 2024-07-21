import React from 'react';

import './emptyErrorPopup.scss';

interface EmptyErrorProps {
    setEmptyErrorPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EmptyErrorPopup: React.FC<EmptyErrorProps> = ({ setEmptyErrorPopUp }) => {
    return (
        <div className="empty-error-popup-overlay" onClick={() => setEmptyErrorPopUp(false)}>
            <div className="empty-error-popup" onClick={(e) => e.stopPropagation()}>
                <div className="empty-popup-container">
                    <p>שם משתמש לא נמצא</p>
                    <p>נא להזין שם משתמש באנגלית ובלי רווחים</p>
                    <button className="empty-error-button" onClick={() => setEmptyErrorPopUp(false)}>אישור</button>
                </div>
            </div>
        </div>
    );
};

export default EmptyErrorPopup;
