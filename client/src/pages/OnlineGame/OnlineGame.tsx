import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from 'axios';

import "./onlineGame.scss";

const OnlineGame = () => {
    const [rivalUsername, setRivalUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { refetch } = useQuery({
        queryKey: ['users', rivalUsername],
        queryFn: async () => {
            try {
                const response = await axios.get(`/api/auth/${rivalUsername}`);
                return response.data;
            } catch (error) {
                throw new Error('Failed to fetch user data');
            }
        },
        enabled: false,
    });

    const createChannel = async () => {
        setIsLoading(true);
        setError("");

        try {
            const result = await refetch();
            setIsLoading(false);

            if (result.data) {
                alert(`Hey ${result.data}, you have been invited to play!`);
            } else {
                alert("User not found.");
            }
        } catch (error) {
            setIsLoading(false);
            setError("Failed to fetch user data");
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <div className="join-game">
            <h4 className="create-game">צור משחק</h4>
            <input
                className="rival-input"
                value={rivalUsername}
                onChange={e => setRivalUsername(e.target.value)}
                placeholder="שם משתמש של יריב"
            />
            <button className="join-game-button" onClick={createChannel} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'הצטרף/התחל משחק'}
            </button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default OnlineGame;
