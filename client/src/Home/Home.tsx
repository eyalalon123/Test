import axios from "axios";

const Home = () => {

    async function handleUsers() {
        try {
            const response = await axios.get("http://localhost:5000/users");
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    return (
        <>
            <button onClick={handleUsers}>Fetch Users</button>
        </>
    );
};

export default Home;
