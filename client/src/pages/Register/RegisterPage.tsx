import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios';
import { useQuery, useMutation } from "@tanstack/react-query";

import "./RegisterPage.scss";

interface User {
    name: string;
    phoneNumber: string;
    password: string;
}

const RegisterPage = () => {
    const [formData, setFormData] = useState<User>({ name: "", phoneNumber: "", password: "" });
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [showText, setShowText] = useState<Boolean>(false);

    const navigate = useNavigate();

    const { refetch } = useQuery({
        queryKey: ["users"],
    });

    const { mutate, isError } = useMutation({
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

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = () => {
        mutate(formData);
    };

    const handleShowText = () => {
        setShowText(true)
    };

    return (
        <div className="home-page-container">
            <div className="title">
                <h2>הרשמה</h2>
                <p>זה פשוט וקל</p>
            </div>
            <div className="input-fields">
                <input
                    type="text"
                    name="name"
                    placeholder="שם"
                    maxLength={20}
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <input
                    type={"tel"}
                    name="phoneNumber"
                    placeholder="מספר פלאפון"
                    maxLength={10}
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                />
                <div className="password_container">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        placeholder="סיסמא"
                        maxLength={20}
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <button
                        type="button"
                        className="password_toggle"
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? "🙈" : "👁️"}
                    </button>
                </div>
                <img onClick={handleShowText} src="src/images/info_Icon.png" alt="info" className="info-icon" />
                {isError && <p className="error-data">שגיאה בנתונים</p>}
                {showText &&
                    <div className="text-icon-container">
                        <p>שם חייב להכיל אותיות באנגלית או בעברית בלבד</p>
                        <p>מספר פלאפון חייב להיות 10 ספרות בדיוק</p>
                        <p>סיסמה צריכה מינימום 6 אותיות ,להכיל אות קטנה באנגלית אות גדולה באנגלית ומספר אחד לפחות</p>
                    </div>
                }
                <button className="button-handle-users" onClick={handleSubmit}>הרשמה</button>
                <button className="button-handle-users" onClick={() => navigate('/login')}>חזרה לעמוד הראשי</button>
            </div>
        </div >
    );
};

export default RegisterPage;