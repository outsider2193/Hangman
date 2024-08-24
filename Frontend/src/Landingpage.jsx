import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Landingpage() {
    const navigate = useNavigate();

    function handleLogin() {
        navigate("/login");
    }

    function handleRegister() {
        navigate("/Register")
    }
    return (
        <Container maxWidth="sm">
            <Typography variant="h2" sx={{ textWrap: "inherit" }} gutterBottom> Welcome to Hangman</Typography>
            <br />
            <Button variant="text" onClick={handleLogin} >Login</Button>
            <Button variant="text" onClick={handleRegister}>Register</Button>
        </Container>
    )
}

export default Landingpage;