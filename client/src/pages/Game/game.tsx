import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useUserContext } from '../../common/context/userContext';

import "./game.scss";

type CategoryData = {
    _id: string;
}

interface SubmitAnswersResponse {
    [key: string]: boolean;
}

const GamePage = () => {
    const { user } = useUserContext();
    const [inputs, setInputs] = useState(Array(9).fill(''));
    const [timeLeft, setTimeLeft] = useState(60);
    const [chosenLetter, setChosenLetter] = useState('');
    const values = ['ארץ', 'עיר', 'חי', 'צומח', 'דומם', 'ילד', 'ילדה', 'מקצוע', 'מפורסם']
    const hebrewLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];
    const [results, setResults] = useState<{ [key: string]: boolean }>({});

    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()

    const addRandomLetter = () => {
        const randomIndex = Math.floor(Math.random() * hebrewLetters.length);
        const randomLetter = hebrewLetters[randomIndex];
        setChosenLetter(randomLetter);
        startTimer();
    };

    useEffect(() => {
        if (timeLeft === 0) {
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

    const { data: ids } = useQuery<string[] | any>({
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

    const { mutate: submitAnswers } = useMutation<SubmitAnswersResponse, Error, { answers: string[], letter: string }>({
        mutationFn: async ({ answers, letter }) => {
            try {
                const results: SubmitAnswersResponse = {};

                for (const id of ids) {
                    const response = await axios.post(`/api/games/submit/${id}`, { answers, letter });
                    results[id] = response.data;
                }
                return results;
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
        submitAnswers({ answers: inputs, letter: chosenLetter });
        clearInterval(intervalId)
    }

    if (!user) return <div>Loading...</div>;
    console.log(results);

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

export default GamePage;