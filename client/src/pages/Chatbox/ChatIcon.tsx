import React, { useState, useRef, useEffect } from 'react';

import { useGame } from '../../common/context/GameContext';

import ChatBox from './Chatbox';

import './chatIcon.scss';

const ChatIcon: React.FC = () => {
    const { newMessage, setNewMessage, updateNewMessageCount, newMessageCount } = useGame();

    const [isChatOpen, setChatOpen] = useState(false);

    const popupRef = useRef<HTMLDivElement | null>(null);

    const toggleChat = () => {
        setChatOpen(prevState => {
            if (!prevState) updateNewMessageCount(0);
            return !prevState;
        });
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setChatOpen(false);
        }
    };

    useEffect(() => {
        if (isChatOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            setNewMessage(false);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isChatOpen, setNewMessage]);

    return (
        <div className="chat-icon-container">
            <div
                className="chat-icon"
                onClick={toggleChat}
                aria-expanded={isChatOpen}
                aria-label="Toggle chat"
            >
                {newMessage && !isChatOpen && newMessageCount > 0 && <div className="new-message-indicator">{newMessageCount}</div>}
                <span className='chat-span' role="img" aria-label="chat">💬</span>
            </div>
            {isChatOpen &&
                <>
                    <div className="chat-overlay" />
                    <div className="chat-popup" ref={popupRef}>
                        <span className='close-chat-span' onClick={() => setChatOpen(false)}>×</span>
                        <ChatBox />
                    </div>
                </>
            }
        </div>
    );
};

export default ChatIcon;
