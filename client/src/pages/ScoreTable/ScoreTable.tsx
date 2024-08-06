import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useGame } from "../../common/context/GameContext";
import { useUser } from "../../common/context/UserContext";
import NoResultsPopup from "../GenericPopup/NoResultsPopup";
import InvitationPopup from "../GenericPopup/InvitationPopup";
import { useSocket } from "../../common/context/SocketContext";

import "./scoreTable.scss";

type GameResult = {
    gameId: string;
    userName: string;
    opponentName: string;
    winner: string;
    scores: { [key: string]: number };
};

const ScoreTable = () => {
    const { user } = useUser();
    const socket = useSocket();
    const { gameId } = useGame();
    const navigate = useNavigate()

    const [popupJoinRoom, setPopupJoinRoom] = useState(false);
    const [scoreTable, setScoreTable] = useState<GameResult[]>([]);
    const [noResultsPopup, setNoResultsPopup] = useState<boolean>(false);

    socket?.on('invitation-for-game', () => {
        setPopupJoinRoom(true);
    });

    useEffect(() => {
        if (user?._id) {
            getScoreTable();
        }
    }, [user]);

    const getScoreTable = async () => {
        try {
            const response = await axios.get('/api/game-room/get-score-table', {
                params: { playerId: user?._id }
            });
            setScoreTable(response.data.reverse());
        } catch (err) {
            if (scoreTable.length === 0) setNoResultsPopup(true)
            console.log('Error fetching score table: ', err);
        }
    };

    const extractNumbers = (result: { [key: string]: number }) => {
        return Object.values(result).reverse().filter(value => typeof value === 'number').join(' - ');
    };

    return (
        <>
            {noResultsPopup && <NoResultsPopup setNoResultsPopup={setNoResultsPopup} />}
            <div className="score-table-container">
                <div className='arrow-back-container'>
                    <ArrowBackIcon className='arrow-back-icon' onClick={() => navigate(-1)} />
                </div>
                <ul className="score-table-list">
                    <h2 className="score-table-title">תוצאות קודמות:</h2>
                    {scoreTable.map((game) => (
                        <li key={game.gameId} className={game.winner === user?._id ? "score-table-item-win" : game.winner === 'draw' ? "score-table-item-draw" : "score-table-item-lose"} >
                            <div className="game-result">
                                <p>מספר משחק: {game.gameId}</p>
                                <p> יריבים: {game.userName} נגד {game.opponentName}</p>
                                <p>
                                    תוצאה: {game.winner === user?._id ?
                                        <span className="win">{game.userName} ניצח</span> :
                                        (game.winner === 'draw' ?
                                            <span className="draw">Draw</span> :
                                            <span className="lose">{game.opponentName} ניצח</span>)}
                                </p>
                                <p>תוצאה סופית: {extractNumbers(game.scores)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div >
            {popupJoinRoom &&
                <InvitationPopup gameId={gameId} setPopUp={setPopupJoinRoom} />
            }
        </>
    );
};

export default ScoreTable;
