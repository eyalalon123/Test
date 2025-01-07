import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useGame } from "../../common/context/GameContext";
import { useSocket } from "../../common/context/socketContext";

import AddWordPopup from "../GenericPopup/AddWordPopup";
import InvitationPopup from "../GenericPopup/InvitationPopup";

import "./addWords.scss";

const AddWords: React.FC = () => {
    const socket = useSocket();
    const { gameId } = useGame();
    const navigate = useNavigate()

    const [newWord, setNewWord] = useState("");
    const [mistakeWord, setMistakeWord] = useState("");
    const [correctedWord, setCorrectedWord] = useState("");
    const [popupJoinRoom, setPopupJoinRoom] = useState(false);
    const [addWordPopup, setAddWordPopup] = useState<boolean>(false);

    socket?.on('invitation-for-game', () => {
        setPopupJoinRoom(true);
    });

    const handleAddWord = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newWord.trim()) return;
        try {
            await axios.post('/api/tests/add-word', {
                newWord
            })
            if (newWord) {
                setNewWord("");
                setAddWordPopup(true);
            }
        }
        catch (err) {
            console.log('err: ', err);
        }
    }

    const handleCorrectMistake = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!correctedWord.trim() || !mistakeWord.trim()) return;
        try {
            if (mistakeWord === correctedWord) return
            await axios.post('/api/tests/fix-word',
                { mistakeWord, correctedWord });

            if (mistakeWord && correctedWord) {
                setMistakeWord("");
                setCorrectedWord("");
                setAddWordPopup(true);
            }
        }
        catch (err) {
            console.log('err: ', err);
        }
    };

    return (
        <>
            {addWordPopup && <AddWordPopup setAddWordPopup={setAddWordPopup} />}
            <div className="add-words-container">
                <div className='arrow-back-container'>
                    <ArrowBackIcon className='arrow-back-icon' onClick={() => navigate('/home')} />
                </div>
                <h2>הוסף מילה חדשה</h2>
                <form onSubmit={handleAddWord}>
                    <input
                        maxLength={30}
                        type="text"
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)}
                        placeholder="הכנס מילה חדשה"
                    />
                    <button type="submit">הוסף מילה</button>
                </form>
                <h2>תקן מילה שגויה</h2>
                <form onSubmit={handleCorrectMistake}>
                    <input
                        maxLength={30}
                        type="text"
                        value={mistakeWord}
                        onChange={(e) => setMistakeWord(e.target.value)}
                        placeholder="המילה השגויה"
                    />
                    <input
                        maxLength={30}
                        type="text"
                        value={correctedWord}
                        onChange={(e) => setCorrectedWord(e.target.value)}
                        placeholder="המילה הנכונה"
                    />
                    <button type="submit">שלח תיקון</button>
                </form>
            </div>
            {
                popupJoinRoom &&
                <InvitationPopup gameId={gameId} setPopUp={setPopupJoinRoom} />
            }
        </>
    );
};

export default AddWords;
