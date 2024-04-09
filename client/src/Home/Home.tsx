import axios from "axios";

const Home = () => {

    async function handleUsers() {
        try {
            const response = await axios.get("http://localhost:8000/users");
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    return (
        <>
            <div>
                <button onClick={handleUsers}>Fetch Users</button>
            </div>
        </>
    );
};

export default Home;
