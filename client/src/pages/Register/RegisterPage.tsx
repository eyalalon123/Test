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

    const { refetch } = useQuery({
        queryKey: ["users"],
    });

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (newUser: User) =>
            axios.post('/api/auth/register', newUser),
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
                {isError && <p className="error-data">error in the data</p>}
                {isPending && <p className="pending-data">data is added</p>}
                <button className="button-handle-users" onClick={handleSubmit}>register</button>
            </div>
        </div>
    );
};

export default RegisterPage;