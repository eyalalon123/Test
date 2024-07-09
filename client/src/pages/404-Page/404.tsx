import { useNavigate } from "react-router-dom";

import "./404.scss"

const Page_404 = () => {
    const navigate = useNavigate()

    return (
        <div className="not-found-page-container">
            <div className="message-404">שגיאה 404</div>
            <button className="button-404" onClick={() => navigate('/home')}>לחץ כאן לחזרה לעמוד הבית</button>
        </div>
    )

}
export default Page_404;