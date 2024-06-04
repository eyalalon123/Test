import axios from "axios";
import { useState } from "react";

import "./home.scss"

interface users {
    name: string;
    _id: string
    phoneNumber: string;
}
const Home = () => {
    const [users, setUsers] = useState<users[]>([]);
    const [loading, setLoading] = useState(false);

    async function handleUsers() {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="home-page-container">
            <button className="button-handle-users" onClick={handleUsers}>Fetch Users</button>
            <div className="data-container">
                {loading && <p>Loading...</p>}
                <div>
                    {users.map((user) => (
                        <p key={user._id}>{user.name} + {user.phoneNumber}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
