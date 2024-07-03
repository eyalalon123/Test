import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../common/context/userContext';

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
                <button onClick={handleGame}>התחל משחק</button>
                <button onClick={logout}>התנתק</button>
            </div>
        </div>
    );
};

export default HomePage;
