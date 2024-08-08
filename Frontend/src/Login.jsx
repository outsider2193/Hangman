import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { Container, Typography, Button, TextField, Card, CardContent, Box } from "@mui/material"
import { blueGrey } from "@mui/material/colors";
function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const [formValid, setFormValid] = useState(JSON.parse(localStorage.getItem("authenticated")) || false);

    const [api, setAPI] = useState();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordValidation = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;

    useEffect(() => {
        validateForm();
    }, [email, password]);

    function handleEmail(event) {
        const value = event.target.value;
        setEmail(value);
        if (!emailPattern.test(value.trim())) {
            setEmailError("Invalid email format!")
        }
        else {
            setEmailError("");
        }
    }
    function handlePassword(event) {
        const value = event.target.value;
        setPassword(value)
        if (!passwordValidation.test(value.trim())) {
            setPasswordError("Invalid Password format!")
        }
        else {
            setPasswordError("")
        }
    }
    function toggleShowPassword() {
        setShowPassword(prevShowPassword => !prevShowPassword);
    }

    function validateForm() {
        const isValid =

            emailPattern.test(email.trim()) &&
            passwordValidation.test(password.trim());

        setFormValid(isValid);
    }

    function toggleSubmit() {
        const loginData = {
            email: email,
            password: password
        }

        if (formValid) {
            axios.post("http://localhost:5000/user/login", loginData).then(response => {
                setAPI(response.data.token);
                console.log(response.data);
                localStorage.setItem('authToken', response.data.token);
                console.log(localStorage);
                setEmail("");
                setPassword("");
                localStorage.setItem("authenticated", JSON.stringify(true));
                navigate("/Mainmenu");
                toast.success("Successfully logged in!", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });

            }).catch(error => {
                toast.error("Login failed. Please check your credentials.", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            });
        }
    }
    return (
        <Container maxWidth="sm" >
            <Box display="flex"
                justifyContent="center"
                alignItems="centre"
                minHeight="10vh">
                <Card
                    sx={{
                        width: '100%',
                        bgcolor: "rgba(128, 128, 128, 0.2)",
                        boxShadow: 'initial'

                    }}>
                    <CardContent>

                        <Typography variant="h4" gutterBottom>Welcome to Hangman</Typography>
                        <p>Enter your email:</p>
                        <TextField variant="outlined" label="Email" value={email} onChange={handleEmail} />
                        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}

                        <p>Enter password:</p>
                        <div>
                            <TextField
                                variant="outlined" label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePassword}
                            />
                            <Button variant="outlined" onClick={toggleShowPassword}
                                sx={{
                                    padding: "20px",
                                    height: '20px',
                                    width: "20px",
                                    fontSize: "12px",
                                    bgcolor: 'blueGrey'
                                }}

                            >
                                {showPassword ? "Hide" : "Show"}</Button>
                        </div>
                        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                        <br />
                        <Button variant="contained" onClick={toggleSubmit} disabled={!formValid}>Submit</Button>
                        <ToastContainer />
                    </CardContent>
                </Card>
            </Box>
        </Container >



    )
}
export default Login