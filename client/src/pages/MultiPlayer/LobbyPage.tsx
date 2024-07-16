import { useState } from 'react';

import axios from 'axios';

import { useSocket } from '../../common/context/SocketContext';
import { useGame } from '../../common/context/GameContext';
import { useUser } from '../../common/context/UserContext';

import MultiPlayer from '../Game/MultiPlayer';

import './lobbyPage.scss';

const LobbyPage = () => {
    const { setGameId } = useGame();
    const { user } = useUser();
    const socket = useSocket();

    const [startTime, setStartTime] = useState<boolean>(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [rivalUsername, setRivalUsername] = useState('');
    const [chosenLetter, setChosenLetter] = useState('');
    const [, setShowEndGamePopup] = useState(false);

    const invitePlayer = async () => {
        if (!rivalUsername.trim()) {
            console.log('שם המשתמש לא יכול להיות ריק');
            return;
        }
        try {
            await axios.post('/api/game-room', {
                playerId: user?._id,
                opponentName: rivalUsername
            })
        }
        catch (err) {
            console.log('err: ', err);
        }
    };

    socket?.on('start-game', ({ randomLetter, gameId }) => {
        setChosenLetter(randomLetter)
        setGameStarted(true);
        setStartTime(true);
        setGameId(gameId)
    })

    return (
        <>
            {
                !gameStarted ?
                    <div className="online-game">
                        <div className="join-game">
                            <h4 className="create-game">צור משחק</h4>
                            <input
                                className="rival-input"
                                value={rivalUsername}
                                onChange={(e) => setRivalUsername(e.target.value)}
                                placeholder="שם משתמש של יריב"
                            />
                            <button className="join-game-button" onClick={invitePlayer}>הצטרף / התחל משחק</button>
                        </div>
                    </div>
                    :
                    <MultiPlayer setEndGamePopUp={setShowEndGamePopup} text='התחל סיבוב נוסף' startTime={startTime} chosenLetter={chosenLetter} />
            }
        </>
    );
};

export default LobbyPage;
