import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import axios from 'axios';
import { useUser } from '../../common/context/userContext';

import ErrorPopup from '../GenericPopup/ErrorPopup';
import EndGamePopUp from '../GenericPopup/EndGamePopup';

import { CATEGORIES } from './game.consts';

import "./game.scss";

type CategoryData = {
    _id: string;
}

type PlayersData = {
    chosenLetter: string;
    startTime?: boolean;
    text: string;
    handleStartNewGame?: () => void;
    setEndGamePopUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const MultiPlayer: React.FC<PlayersData> = ({ chosenLetter, startTime, text, handleStartNewGame, setEndGamePopUp }) => {
    const { user } = useUser();

    const [showEndGamePopup, setShowEndGamePopup] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [inputs, setInputs] = useState(Array(9).fill(''));
    const [results, setResults] = useState<boolean[]>([]);
    const [timeLeft, setTimeLeft] = useState(60);

    const addRandomLetter = () => {
        setResults([])
        setInputs(Array(9).fill(''))
    };

    useEffect(() => {
        if (timeLeft === 0) {
            submitAnswers({ answers: inputs, letter: chosenLetter });
            clearInterval(intervalId)
        }
    }, [timeLeft])

    useEffect(() => {
        startTimer()
    }, [startTime])

    const startTimer = () => {
        setTimeLeft(60);
        intervalId && clearInterval(intervalId);

        const interval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        setIntervalId(interval)
    }


    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
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
        submitAnswers({ answers: inputs, letter: chosenLetter });
        if (intervalId) clearInterval(intervalId);
        setShowEndGamePopup(true);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <>
            {showErrorPopup && <ErrorPopup setErrorPopUp={setShowErrorPopup} />}
            {showEndGamePopup && <EndGamePopUp handleStartNewGame={handleStartNewGame} text={text} setEndGamePopUp={setEndGamePopUp} />}
            <div className="game-page">
                <div className="timer">זמן:{timeLeft}</div>
                <div className='random-letter-container'>
                    <button className='random-letter-button' onClick={addRandomLetter}>בחירת אות אקראית</button>
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
                <button className='send-button' onClick={finishGame}>שליחה</button>
            </div>
        </>
    );
};

export default MultiPlayer;
