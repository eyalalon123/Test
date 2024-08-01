import axios from 'axios';
import { useState } from 'react';

import { useGame } from '../../common/context/GameContext';
import { useUser } from '../../common/context/UserContext';

import './chatbox.scss'

const ChatBox = () => {
    const { user } = useUser();
    const { chat, gameId, opponentId, addMessage } = useGame();

    const [message, setMessage] = useState<string>()

    const sendMessage = async () => {
        if (!user || !message) return;

        const date = new Date();

        addMessage({
            content: message,
            senderId: user?._id,
            date,
        })

        try {
            await axios.post('/api/game-room/new-message', {
                gameId,
                senderId: user._id,
                receiverId: opponentId,
                text: message,
                date,
            })
            setMessage('')
        }
        catch (err) {
            console.log('err: ', err);
        }
    }

    return (
        <div className="chatbox-container">
            <div className="chatbox-messages">
                {chat.map((msg, index) => {
                    if (typeof msg.date === 'string')
                        msg.date = new Date(msg.date);
                    return (
                        <div key={index} className={`${msg.senderId === user?._id ? 'message-you' : 'message-opponent'}`}>
                            <>
                                <p className='p-title'>{msg.senderId === user?._id ? 'You: ' : 'Opponent: '}</p>
                                <p className='p-content'>{msg.content}</p>
                                <p className='p-date'>{msg.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </>
                        </div>
                    )
                })}
            </div>
            <div className="chatbox-input">
                <input
                    maxLength={70}
                    type="text"
                    value={message || ""}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                    placeholder="Type a message..."
                />
            </div>
            <button className='chatbox-button' onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatBox;
