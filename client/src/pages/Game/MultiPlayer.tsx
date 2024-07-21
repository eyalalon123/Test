import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import axios from 'axios';

import { useUser } from '../../common/context/UserContext';
import { useGame } from '../../common/context/GameContext';

import ErrorPopup from '../GenericPopup/ErrorPopup';
import EndGamePopUp from '../GenericPopup/EndGamePopup';

import { CATEGORIES } from './game.consts';

import "./game.scss";

type ResultsData = {
    results: boolean[],
    score: number,
}

const MultiPlayer: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { gameId, chosenLetter, opponentId, timeLeft, showEndGamePopup, scoreP1, scoreP2 } = useGame()
    const [, setPointResults] = useState<number>(0);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [inputs, setInputs] = useState(Array(9).fill(''));
    const [results, setResults] = useState<boolean[]>([]);

    useEffect(() => {
        if (timeLeft === 0) {
            submitAnswers({ answers: inputs, letter: chosenLetter! });
        }
    }, [timeLeft])

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };

    const { data: ids } = useQuery<string[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            try {
                const response = await axios.get<{ _id: string }[]>(`/api/games`);
                const ids = response.data.map(category => category._id);
                return ids;
            } catch (error) {
                throw new Error('Failed to fetch category data');
            }
        },
    });

    const { mutate: submitAnswers } = useMutation<ResultsData, Error, { answers: string[], letter: string }>({
        mutationFn: async ({ answers, letter }) => {
            try {
                if (!ids) throw new Error('Category IDs not available');

                const payload = ids.map((id, index) => ({
                    categoryId: id,
                    answer: answers[index],
                }));

                const { data } = await axios.post<ResultsData>('/api/game-room/end-game', {
                    answers: payload,
                    letter,
                    playerId: user?._id,
                    gameId: gameId,
                });
                return data;
            } catch (error) {
                throw new Error('Failed to submit answers');
            }
        },
        onSuccess: ({ results, score }) => {
            setPointResults(score)
            setResults(results);
        },
        onError: (error) => {
            console.error('Error submitting answers:', error);
        },
    });

    const handleFinishGame = () => {
        if (!chosenLetter) {
            setShowErrorPopup(true)
            return
        };
        submitAnswers({ answers: inputs, letter: chosenLetter });
    };

    const handleInviteNewGame = async () => {
        try {
            await axios.post('/api/game-room/new-round', {
                playerId: user?._id,
                opponentId,
                gameId
            })
        }
        catch (err) {
            console.log('err: ', err);
        }
    };

    const handleStartNewGame = async () => {
        try {
            await axios.post('/api/game-room/join-game', {
                playerId: user?._id,
                gameId
            })
        }
        catch (err) {
            console.log('err: ', err);
        }
    };

    const handleUserGoBackHome = () => {
        navigate('/home')
    }

    if (!chosenLetter) handleUserGoBackHome();
    if (!user) return <div>Loading...</div>;

    return (
        <>
            {showErrorPopup && <ErrorPopup setErrorPopUp={setShowErrorPopup} />}
            {showEndGamePopup && <EndGamePopUp handleUserGoBackHome={handleUserGoBackHome} handleStartNewGame={handleStartNewGame} handleInviteNewGame={handleInviteNewGame} scoreP2={scoreP2} scoreP1={scoreP1} />}
            <div className="game-page">
                <div className="timer">זמן:{timeLeft}</div>
                <div className='random-letter-container'>
                    <p className='chosen-letter'>{chosenLetter}</p>
                </div>
                <div className="inputs">
                    {inputs.map((input, index) => (
                        <div key={index} className="input-container">
                            <label className='label-value'>{CATEGORIES[index]}</label>
                            <input
                                className={results[index] === true ? "true-answer" :
                                    results[index] === false ? "false-answer" : "reset-answer"
                                }
                                disabled={timeLeft === 0}
                                value={input}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <button className='send-button' onClick={handleFinishGame}>שליחה</button>
            </div>
        </>
    );
};

export default MultiPlayer;
