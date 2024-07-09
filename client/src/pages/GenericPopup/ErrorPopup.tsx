import React from 'react';
import './ErrorPopup.scss';

interface ErrorProps {
    setErrorPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ErrorPopUp: React.FC<ErrorProps> = ({ setErrorPopUp }) => {
    return (
        <div className="error-popup-overlay" onClick={() => setErrorPopUp(false)}>
            <div className="error-popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-container">
                    <p>לא נבחרה אות</p>
                    <button className="error-button" onClick={() => setErrorPopUp(false)}>אישור</button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPopUp;
