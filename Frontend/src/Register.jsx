import { Box, Card, CardContent, Container, TextField, Typography, Button } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";

function Register() {
    const [firstname, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");

    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [api, setAPI] = useState();
    const [formValid, setFormValid] = useState(JSON.parse(localStorage.getItem("authenticated")) || false);
    const navigate = useNavigate();

    const validateName = /^[a-zA-Z]{2,}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordValidation = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;

    useEffect(() => {
        validateForm()
    }, [email, password, firstname, lastName])

    function handleName(event) {
        const value = event.target.value;
        setFirstName(value);
        if (!validateName.test(value)) {
            setFirstNameError("Name should be atleast 2 characters long")
        }
        else {
            setFirstNameError("");
        }
    }

    function handleLastName(event) {
        const value = event.target.value;
        setLastName(value);
        if (!validateName.test(value)) {
            setLastNameError("Lastname should be atleast 2 characters long");
        }
        else {
            setLastNameError("");
        }
    }

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
        const isValid = validateName.test(firstname.trim()) &&
            validateName.test(lastName.trim()) &&
            emailPattern.test(email.trim()) &&
            passwordValidation.test(password.trim());
        setFormValid(isValid);
    }

    function toggleSubmit() {

        const userInfo =
        {
            firstName: firstname,
            lastName: lastName,
            email: email,
            password: password
        }
        if (formValid) {
            axios.post("http://localhost:5000/user/register", userInfo).then(response => {
                setAPI(response.data.token);
                console.log(response.data);
                localStorage.setItem('authToken', response.data.token);
                console.log(localStorage);
                setEmail("");
                setPassword("");
                setFirstName("");
                setLastName("");
                localStorage.setItem("authenticated", JSON.stringify(true));
                navigate("/login");
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    toast.error("User Already exists!", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    });
                }
                else {
                    console.error("Registration failed", error)
                    setEmailError("Registration failed. Please try again later.");
                }
            })
        }
    }


    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="centre"
                minHeight="10vh"

            >
                <Card

                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        padding: "20px",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        borderRadius: "12px",
                    }}
                >
                    <CardContent>
                        <Typography variant="h4" sx={{ textAlign: "center" }} >Register to create new account</Typography>
                        <br />

                        <TextField variant="outlined"
                            sx={{
                                marginBottom: "16px",
                                input: { color: 'black' },
                                label: { color: '#ccc' }
                            }}
                            value={firstname} label="Enter your Firstname" onChange={handleName}></TextField>
                        {firstNameError && <p style={{ color: 'red' }}>{firstNameError}</p>}
                        <br />
                        <TextField variant="outlined"
                            sx={{
                                marginBottom: "16px",
                                input: { color: 'black' },
                                label: { color: '#ccc' }
                            }}
                            value={lastName} onChange={handleLastName} label="Enter your Lastname"></TextField>
                        {lastNameError && <p style={{ color: 'red' }}>{lastNameError}</p>}
                        <br />
                        <TextField variant="outlined"
                            sx={{
                                marginBottom: "16px",
                                input: { color: 'black' },
                                label: { color: '#ccc' }
                            }}
                            value={email} onChange={handleEmail} label="Enter your Email"></TextField>
                        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                        <br />

                        <TextField variant="outlined" type={showPassword ? "text" : "password"}
                            sx={{
                                marginBottom: "16px",
                                input: { color: 'black' },
                                label: { color: '#ccc' }
                            }}
                            label="Enter your Password" onChange={handlePassword}></TextField>

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
                        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                        <br />
                        <Button variant="contained" onClick={toggleSubmit} disabled={!formValid}>Submit</Button>
                        <ToastContainer />
                    </CardContent>
                </Card>
            </Box>
        </Container>
    )

}

export default Register;