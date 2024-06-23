import { useNavigate } from "react-router-dom";

import "./404.scss"

const Page_404 = () => {
    const navigate = useNavigate()

    return (
        <div className="not-found-page-container">
            <div className="message-404">404 page not found</div>
            <button className="button-404" onClick={() => navigate('/users')}>click here to home page</button>
        </div>
    )

}
export default Page_404;