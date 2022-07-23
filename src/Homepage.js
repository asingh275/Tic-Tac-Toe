// Creating socket and connecting for testing
import io from "socket.io-client";
const socket = io.connect("http://localhost:8080");

const Homepage = (props) => {
    return (<h1>Tic Tac Toe</h1>);
};

export default Homepage;