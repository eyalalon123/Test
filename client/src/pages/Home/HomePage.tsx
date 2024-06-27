import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import "./homePage.scss"

interface Tests {
    name: string;
}

const HomePage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["tests"],
        queryFn: () => axios.get('/api/tests', {
            withCredentials: true,
        }).then(res => res.data),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="home-page">
            <h1>Welcome to the Home Page</h1>
            <div className="data-container">
                {data && data.map((tests: Tests, index: number) => (
                    <p key={index}>Name: {tests.name}</p>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
