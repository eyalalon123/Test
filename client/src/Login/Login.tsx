import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent } from "react";

import "../Login/login.scss"

const Login = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const password = "123456"
    const [errorMessage, setErrorMessage] = useState("");

    const handlePhoneInput = (e: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);

    };

    const handleCodeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
    };

    const handleLogin = () => {
        if (code === password && phoneNumber)
            navigate("/users");
        else {
            setErrorMessage("סיסמא או מספר פלאפון לא נכונים")
        }
    };

    return (
        <>
            <div className="login_page">
                <div className="login_inputs_container">
                    <span className="text_username">מספר פלאפון</span>
                    <input required placeholder="הכנס מספר פלאפון" className="phone_input" maxLength={10} onChange={handlePhoneInput} value={phoneNumber}></input>
                    <span className="text_password">סיסמא</span>
                    <input required placeholder="הכנס סיסמא" className="code_input" maxLength={6} onChange={handleCodeInput} value={code}></input>
                    {errorMessage && (
                        <p className="error_message">
                            {errorMessage}
                        </p>
                    )}
                </div>
                <button className="login_button" onClick={handleLogin}>
                    התחבר
                </button>
            </div>
        </>
    );
};

export default Login;
