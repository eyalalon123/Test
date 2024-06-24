import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import "./RegisterPage.scss";

interface User {
    name: string;
    phoneNumber: string;
    password: string;
}

const RegisterPage = () => {

    const [formData, setFormData] = useState<User>({ name: "", phoneNumber: "", password: "" });
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["users"],
        queryFn: () =>
            fetch('http://localhost:8000/users').then(res => res.json())
    });

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (newUser: User) =>
            axios.post('http://localhost:8000/users', newUser),
        onSuccess: () => {
            refetch();
            navigate('/login')
            setFormData({ name: "", phoneNumber: "", password: "" });
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        mutate(formData);
    };

    return (
        <div className="home-page-container">
            <div className="input-fields">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    maxLength={20}
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    maxLength={10}
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    maxLength={20}
                    value={formData.password}
                    onChange={handleInputChange}
                />
                {isLoading && <p className="loading-data">loading...</p>}
                {isError && <p className="error-data">error in the data</p>}
                {isPending && <p className="pending-data">data is added</p>}
                <button className="button-handle-users" onClick={handleSubmit}>register</button>
            </div>
            {/* <div className="data-container">
                <h3>users:</h3>
                {data && data.map((user: User, index: number) => (
                    <p key={index}>name: {user.name} - phoneNumber: {user.phoneNumber} - password: {user.password}</p>
                ))}
            </div> */}
        </div>
    );
};

export default RegisterPage;