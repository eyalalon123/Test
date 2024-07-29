import React, { useState, useRef, useEffect } from 'react';

import ChatBox from './Chatbox';

import './chatIcon.scss';

const ChatIcon: React.FC = () => {
    const [isChatOpen, setChatOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    const toggleChat = () => {
        setChatOpen(!isChatOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setChatOpen(false);
        }
    };

    useEffect(() => {
        if (isChatOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isChatOpen]);

    return (
        <div className="chat-icon-container">
            <div className="chat-icon" onClick={toggleChat}>
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
