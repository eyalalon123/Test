import { useUserContext } from '../../common/context/userContext';
import { useNavigate } from 'react-router-dom';

import "./homePage.scss"

const HomePage = () => {
    const { user, logout } = useUserContext();

    const navigate = useNavigate()

    const handleGame = () => {
        navigate('/game')
    }

    if (!user) return <div>Loading...</div>;

    return (
        <div className="home-page">
            <div className="data-container">
                <h2>Welcome to the Home Page {user.name}</h2>
                <button className='start-game-button' onClick={handleGame}>התחל משחק יחיד</button>
                <button className='start-game-button' onClick={() => navigate('/online-game')}>שחק עם חבר</button>
                <button className='start-game-button' onClick={() => console.log("gg")}>טבלת ניקוד</button>
                <button className='start-game-button' onClick={logout}>התנתק</button>
            </div>
        </div>
    );
};

export default HomePage;
