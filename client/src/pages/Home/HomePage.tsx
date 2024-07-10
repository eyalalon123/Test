import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../common/context/socketContext';

import { useUser } from '../../common/context/userContext';
import TwoPlayer from '../Game/TwoPlayer';

import InvitationPopup from '../GenericPopup/InvitationPopup';

import "./homePage.scss"

const HomePage = () => {
    const { user, logout } = useUser();
    const socket = useSocket()
    const [popupJoinRoom, setPopupJoinRoom] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const navigate = useNavigate()

    const handleGame = () => {
        navigate('/game')
    }

    if (!user) return <div>Loading...</div>;

    // useEffect(() => {
    //     try {
    //         const data = axios.post('/api/game-room/join-game', {
    //             playerId: user?._id,
    //             gameId: ''
    //         })
    //         // console.log('data: ', data);
    //         // console.log('user: ', user);
    //     }
    //     catch (err) {
    //         console.log('err: ', err);
    //     }

    // }, [gameStarted])
    // console.log('socket: ', socket);

    socket.on('invitation-for-game', () => {
        setPopupJoinRoom(true)
    });

    // socket.on('start-game', () => {
    // setGameStarted(true)
    // });

    return (
        <>
            {!gameStarted &&
                <>

                    {popupJoinRoom && <InvitationPopup setGameStarted={setGameStarted} setPopUp={setPopupJoinRoom} />}
                    <div className="home-page">
                        <div className="data-container">
                            <h2>Welcome to the Home Page {user.name}</h2>
                            <button className='start-game-button' onClick={handleGame}>התחל משחק יחיד</button>
                            <button className='start-game-button' onClick={() => navigate('/online-game')}>שחק עם חבר</button>
                            <button className='start-game-button' onClick={() => console.log("gg")}>טבלת ניקוד</button>
                            <button className='start-game-button' onClick={logout}>התנתק</button>
                        </div>
                    </div>
                </>
            }
            <TwoPlayer />
        </>
    );
};

export default HomePage;
