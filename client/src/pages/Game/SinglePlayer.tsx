import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import axios from 'axios';

import { useUser } from '../../common/context/UserContext';

import { CATEGORIES, HEBREW_LETTERS } from './game.consts';
import ErrorPopup from '../GenericPopup/ErrorPopup';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import "./game.scss";

type CategoryData = {
    _id: string;
}

const SinglePlayer: React.FC = () => {
    const { user } = useUser();
    const navigate = useNavigate()

    const [timeLeft, setTimeLeft] = useState(60);
    const [chosenLetter, setChosenLetter] = useState('');
    const [results, setResults] = useState<boolean[]>([]);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()
    const [playerAnswers, setPlayerAnswers] = useState(Array(9).fill(''));

    useEffect(() => {
        if (timeLeft === 0) {
            submitAnswers({ answers: playerAnswers, letter: chosenLetter });
            clearInterval(intervalId)
        }
    }, [timeLeft])

    const addRandomLetter = () => {
        const randomIndex = Math.floor(Math.random() * HEBREW_LETTERS.length);
        const randomLetter = HEBREW_LETTERS[randomIndex];
        setChosenLetter(randomLetter);
        startTimer();
        setResults([])
        setPlayerAnswers(Array(9).fill(''))
    };

    const startTimer = () => {
        setTimeLeft(60);
        intervalId && clearInterval(intervalId);

        const interval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        setIntervalId(interval)
    };

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...playerAnswers];
        newInputs[index] = value;
        setPlayerAnswers(newInputs);
    };

    const { data: ids } = useQuery<string[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            try {
                const response = await axios.get<CategoryData[]>(`/api/games`);
                const ids = response.data.map(category => category._id);
                return ids;
            } catch (error) {
                throw new Error('Failed to fetch category data');
            }
        },
    });

    const { mutate: submitAnswers } = useMutation<boolean[], Error, { answers: string[], letter: string }>({
        mutationFn: async ({ answers, letter }) => {
            try {
                if (!ids) throw new Error('Category IDs not available');

                const payload = ids.map((id, index) => ({
                    categoryId: id,
                    answer: answers[index],
                }));

                const response = await axios.post('/api/games/submit', { answers: payload, letter });

                return response.data;
            } catch (error) {
                throw new Error('Failed to submit answers');
            }
        },
        onSuccess: (data) => {
            setResults(data);
        },
        onError: (error) => {
            console.error('Error submitting answers:', error);
        },
    });

    const finishGame = () => {
        if (!chosenLetter) {
            setShowErrorPopup(true)
            return
        };
        submitAnswers({ answers: playerAnswers, letter: chosenLetter });
        if (intervalId) clearInterval(intervalId);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <>
            {showErrorPopup && <ErrorPopup setErrorPopUp={setShowErrorPopup} />}
            <div className="game-page">
                <div className='arrow-back-container'>
                    <ArrowBackIcon className='arrow-back-icon' onClick={() => navigate(-1)} />
                </div>
                <div className="timer">זמן:{timeLeft}</div>
                <div className='random-letter-container'>
                    <button className='random-letter-button' onClick={addRandomLetter}>בחירת אות אקראית</button>
                    <p className='chosen-letter'>{chosenLetter}</p>
                </div>
                <div className="inputs">
                    {playerAnswers.map((playerAnswer, index) => (
                        <div key={index} className="input-container">
                            <label className='label-value'>{CATEGORIES[index]}</label>
                            <input
                                className={results[index] === true ? "true-answer" :
                                    results[index] === false ? "false-answer" : "reset-answer"
                                }
                                disabled={timeLeft === 0}
                                value={playerAnswer}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                    <button className='send-button-single' onClick={finishGame}>שליחה</button>
                </div>
            </div>
        </>
    );
};

export default SinglePlayer;
