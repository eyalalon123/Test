import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useUser } from "../../common/context/userContext";

import "./login.scss";

interface User {
    phoneNumber: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const { login, fetchStatus, isLoggedIn } = useUser();

    const [formData, setFormData] = useState<User>({ phoneNumber: "", password: "" });
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
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
                setError("מספר פלאפון או סיסמה לא נכונים");
            }
        });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    if (fetchStatus === "pending") {
        return null;
    }

    if (isLoggedIn()) {
        return <Navigate to="/home" />
    }

    return (
        <>
            <div className="login_page">
                <h1 className="title">ארץ עיר</h1>
                <div className="login_inputs_container">
                    <input
                        type={"tel"}
                        required
                        name="phoneNumber"
                        placeholder="הכנס מספר פלאפון"
                        className="phone_input"
                        maxLength={10}
                        onChange={handleInputChange}
                        value={formData.phoneNumber}
                    />
                    <div className="password_container">
                        <input
                            required
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            placeholder="הכנס סיסמא"
                            className="code_input"
                            maxLength={20}
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                        <button
                            type="button"
                            className="password_toggle"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {error && <div className="error_message">{error}</div>}
                    <button className="login_button" onClick={handleSubmit}>התחברות</button>
                    <button className="login_button" onClick={() => navigate('/register')}>הרשמה</button>
                </div>
            </div>
        </>
    );
};

export default Login;
