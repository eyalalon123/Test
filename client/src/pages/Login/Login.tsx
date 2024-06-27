import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios';

import "./login.scss";

interface User {
    phoneNumber: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<User>({ phoneNumber: "", password: "" });
    const [error, setError] = useState<string>("");

    const { mutate } = useMutation({
        mutationFn: (newUser: User) =>
            axios.post('/api/auth/login', newUser,),
        onSuccess: (data) => {
            const token = data.data.token;
            localStorage.setItem('token', token);
            navigate('/home');
            setFormData({ phoneNumber: "", password: "" });
        },
        onError: () => {
            setError("Invalid phone number or password");
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
        setError("");
        mutate(formData);
    };

    return (
        <>
            <div className="login_page">
                <div className="login_inputs_container">
                    <span className="text_username">מספר פלאפון</span>
                    <input
                        required
                        name="phoneNumber"
                        placeholder="הכנס מספר פלאפון"
                        className="phone_input"
                        maxLength={10}
                        onChange={handleInputChange}
                        value={formData.phoneNumber}
                    />
                    <span className="text_password">סיסמא</span>
                    <input
                        required
                        name="password"
                        type="password"
                        placeholder="הכנס סיסמא"
                        className="code_input"
                        maxLength={20}
                        onChange={handleInputChange}
                        value={formData.password}
                    />
                    {error && <div className="error_message">{error}</div>}
                    <button className="login_button" onClick={handleSubmit}>התחברות</button>
                    <button className="login_button" onClick={() => navigate('/register')}>הרשמה</button>
                </div>
            </div>
        </>
    );
};

export default Login;
