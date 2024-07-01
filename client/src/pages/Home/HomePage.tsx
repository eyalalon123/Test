// import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../common/context/userContext';

import "./homePage.scss"
const HomePage = () => {
    const { user } = useUserContext();

    // const navigate = useNavigate();

    if (!user) return <div>Loading...</div>;

    return (
        <div className="home-page">
            <div className="data-container">
                <h2>Welcome to the Home Page {user.name}</h2>
            </div>
        </div>
    );
};

export default HomePage;
