import React from 'react';

import './noResultsPopup.scss';

interface NoResultsProps {
    setNoResultsPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NoResultsPopup: React.FC<NoResultsProps> = ({ setNoResultsPopup }) => {
    return (
        <div className="no-results-popup-overlay" onClick={() => setNoResultsPopup(false)}>
            <div className="no-results-popup" onClick={(e) => e.stopPropagation()}>
                <div className="popup-container">
                    <p>אין תוצאות קודמות</p>
                    <button className="no-results-button" onClick={() => setNoResultsPopup(false)}>אישור</button>
                </div>
            </div>
        </div>
    );
};

export default NoResultsPopup;
