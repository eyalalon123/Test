import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent } from "react";

import "../Login/login.scss"

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
        navigate("/1"); 
    };

    return (
        <>
            <div className="login-inputs-container">
                <input maxLength={10} onChange={handlePhoneInput} value={phoneNumber}></input>
                <input maxLength={6} onChange={handleCodeInput} value={code}></input>
            </div>
            <button className="login_button" onClick={handleLogin}>
                Login
            </button>
        </>
    );
};

export default Login;
