import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "./homePage.scss"

interface Users {
    name: string;
}

const HomePage = () => {

    const navigate = useNavigate();

    const fetchTests = async () => {
        try {
            const response = await axios.get('/api/users', {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                navigate('/login');
            }
            throw error;
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: fetchTests,
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="home-page">
            <div className="data-container">
                {data && data.map((users: Users, index: number) => (
                    <h2 key={index}>Welcome to the Home Page {users.name}</h2>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
