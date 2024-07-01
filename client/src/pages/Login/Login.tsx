import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

import "./login.scss";
import { useUserContext } from "../../common/context/userContext";

interface User {
    phoneNumber: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const { login, fetchStatus, isLoggedIn } = useUserContext();
    const [formData, setFormData] = useState<User>({ phoneNumber: "", password: "" });
    const [error, setError] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setError("");
        login(formData, {
            onSuccess: () => {
                navigate("/home");
            },
            onError: () => {
                setError("Phone number or password in incorrect");
            }
        });
    };

    if (fetchStatus === "pending") {
        return null; //return loading | landing
    }

    if (isLoggedIn()) {
        return <Navigate to="/home" />
    }

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
