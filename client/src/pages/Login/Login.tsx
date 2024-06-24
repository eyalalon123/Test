import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent } from "react";

import "./login.scss"

const Login = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const handlePhoneInput = (e: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handleCodeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
    };

    const handleLogin = () => {
        navigate('/home')
    };

    return (
        <>
            <div className="login_page">
                <div className="login_inputs_container">
                    <span className="text_username">מספר פלאפון</span>
                    <input
                        required
                        placeholder="הכנס מספר פלאפון"
                        className="phone_input"
                        maxLength={10}
                        onChange={handlePhoneInput}
                        value={phoneNumber} />
                    <span className="text_password">סיסמא</span>
                    <input
                        required
                        placeholder="הכנס סיסמא"
                        className="code_input"
                        maxLength={6}
                        onChange={handleCodeInput}
                        value={code} />
                    <button className="login_button" onClick={handleLogin}>התחבר</button>
                    <button className="login_button" onClick={() => navigate('/register')}>הרשמה</button>
                </div>
            </div>
        </>
    );
};

export default Login;
