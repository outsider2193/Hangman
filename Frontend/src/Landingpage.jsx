import { Box, Button, Card, CardContent, Container, Typography } from "@mui/material";
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
        <Box
            sx={{
                height: "70vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5", 
                padding: 10,
            }}
        >
            <Container maxWidth="sm">
                <Typography
                    variant="h2"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#333" }} 
                >
                    Welcome to Hangman
                </Typography>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={8}
                    gap={2}
                >
                    <Card
                        sx={{
                            flex: 1,
                            padding: 2,
                            boxShadow: 3,
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" align="center" gutterBottom>Login</Typography>
                            <Button variant="contained" fullWidth color="primary" onClick={handleLogin}>Login</Button>
                        </CardContent>
                    </Card>
                    <Card
                        sx={{
                            flex: 1,
                            padding: 2,
                            boxShadow: 3,
                            transition: "transform 0.3s, box-shadow 0.3s",
                            "&:hover": {
                                transform: "scale(1.05)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" align="center" gutterBottom>Register</Typography>
                            <Button variant="contained" fullWidth color="secondary" onClick={handleRegister}>Register</Button>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}

export default Landingpage;