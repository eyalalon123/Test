import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useUserContext } from '../../common/context/userContext';
import axios from 'axios';

import "./game.scss";

type CategoryData = {
    _id: string;
}

type ResultsData = {
    isCorrect: boolean;
}

const TwoPlayer: React.FC = () => {

    const { user } = useUserContext();
    const [inputs, setInputs] = useState(Array(9).fill(''));
    const [timeLeft, setTimeLeft] = useState(60);
    const [chosenLetter, setChosenLetter] = useState('');
    const values = ['ארץ', 'עיר', 'חי', 'צומח', 'דומם', 'ילד', 'ילדה', 'מקצוע', 'מפורסם']
    const hebrewLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];
    const [results, setResults] = useState<ResultsData[]>([]);

    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()

    const addRandomLetter = () => {
        const randomIndex = Math.floor(Math.random() * hebrewLetters.length);
        const randomLetter = hebrewLetters[randomIndex];
        setChosenLetter(randomLetter);
        startTimer();
        setResults([])
        setInputs(Array(9).fill(''))
    };

    useEffect(() => {
        if (timeLeft === 0) {
            submitAnswers({ answers: inputs, letter: chosenLetter });
            clearInterval(intervalId)
        }
    }, [timeLeft])

    const startTimer = () => {
        setTimeLeft(60);
        intervalId && clearInterval(intervalId);

        const interval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        setIntervalId(interval)
    };


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

    const { mutate: submitAnswers } = useMutation<ResultsData[], Error, { answers: string[], letter: string }>({
        mutationFn: async ({ answers, letter }) => {
            try {
                if (!ids) throw new Error('Category IDs not available');

                const payload = ids.map((id, index) => ({
                    id,
                    answer: answers[index],
                    letter,
                }));

                const response = await axios.post('/api/games/submit', payload);

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
        if (!chosenLetter) return;
        submitAnswers({ answers: inputs, letter: chosenLetter });
        if (intervalId) clearInterval(intervalId);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="game-page">
            <div className="timer">זמן:{timeLeft}</div>
            <div className='random-letter-container'>
                <button className='random-letter-button' onClick={addRandomLetter}>בחירת אות אקראית</button>
                <p className='chosen-letter'>{chosenLetter}</p>
            </div>
            <div className="inputs">
                {inputs.map((input, index) => (
                    <div key={index} className="input-container">
                        <label className='label-value'>{values[index]}</label>
                        <input
                            className={results[index]?.isCorrect === true ? "true-answer" :
                                results[index]?.isCorrect === false ? "false-answer" : "reset-answer"
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
    );
};

export default TwoPlayer;
