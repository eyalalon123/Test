import React from 'react';
import { useNavigate } from 'react-router-dom';

import './addWordPopup.scss';

interface AddWordProps {
    setAddWordPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddWordPopup: React.FC<AddWordProps> = ({ setAddWordPopup }) => {
    const navigate = useNavigate();

    return (
        <div className="add-word-popup-overlay" onClick={() => setAddWordPopup(false)}>
            <div className="add-word-popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-container">
                    <p>המילה נשלחה בהצלחה</p>
                    <p>תודה על עזרתך בשיפור המשחק</p>
                    <button className="add-word-button" onClick={() => setAddWordPopup(false)}>אישור</button>
                    <button className="add-word-button" onClick={() => navigate('/home')}>חזרה לעמוד הבית</button>
                </div>
            </div>
        </div>
    );
};

export default AddWordPopup;
