import { useState, useEffect } from 'react';

import { useSocket } from '../../common/context/SocketContext';

import './chatbox.scss'

const ChatBox = ({ roomId }: { roomId: string }) => {
    const socket = useSocket();

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ userId: string, message: string }[]>([]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('joinRoom', roomId);

        socket.on('chatMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.emit('leaveRoom', roomId);
            socket.off('chatMessage');
        };
    }, [socket, roomId]);

    const sendMessage = () => {
        if (message.trim()) {
            socket?.emit('chatMessage', { room: roomId, message });
            setMessage('');
        }
    };

    return (
        <div className="chatbox-container">
            <div className="chatbox-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`${msg.userId === socket?.id ? 'message-you' : 'message-opponent'}`}>
                        {msg.userId === socket?.id ? 'You: ' : 'Opponent: '}{msg.message}
                    </div>
                ))}
            </div>
            <div className="chatbox-input">
                <input
                    type="text"
                    value={message}
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
