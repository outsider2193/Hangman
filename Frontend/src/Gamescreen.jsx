import { Button, Container, TextField, Typography, Box, Grid } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast, Bounce } from 'react-toastify';


function Gamescreen() {
    const token = localStorage.getItem("authToken");
    const [api, setApi] = useState();
    const [obscuredWord, setObscuredword] = useState();
    const [lives, setLives] = useState();
    const [description, setDescription] = useState();
    const [guess, setGuess] = useState();
    const [guessError, setError] = useState();
    const [isMatchOver, setIsMatchOver] = useState(false);

    const navigate = useNavigate();
    let { matchId } = useParams()



    function handleMatch() {
        axios.get(`http://localhost:5000/match/${matchId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setApi(response.data);
            setObscuredword(response.data.word);
            setLives(response.data.remaining_lives);
            setDescription(response.data.description);

            console.log(response.data);
        })
    }

    useEffect(() => {

        handleMainMenu();
    }, [matchId]);

    function handleMainMenu() {

        axios.get(`http://localhost:5000/match/${matchId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {

            if (response.data.status !== "running") {
                setIsMatchOver(true)

            }
            else {
                setIsMatchOver(false);
            }


        })
    }




    function handleGuesses(event) {
        const value = event.target.value;
        setGuess(value);
        const isValid = /^[a-z]$/;
        if (!isValid.test(value)) {
            setError("Invalid format!")


        }
        else {
            setError("");


        }
    }
    const isValidGuess = /^[a-z]$/.test(guess);

    function toggleSubmmit() {
        const guessWord = {
            guess: guess
        }
        axios.post(`http://localhost:5000/match/${matchId}/guess`, guessWord,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                axios.get(`http://localhost:5000/match/${matchId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    setApi(response.data);
                    setObscuredword(response.data.word);
                    setLives(response.data.remaining_lives);
                    setDescription(response.data.description);

                    console.log(response.data);
                })

                if (response.data.message === "correct guess") {
                    toast.success("Correct guess", {
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
                else if (response.data.message === "Incorrect guess") {
                    toast.error("Incorrect guess", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    })
                }

                else if (response.data.message === "You won!") {
                    toast.success("You won", {
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
                    setIsMatchOver(true);

                }

                else if (response.data.message === "You lost!") {
                    toast.error("You Lose", {
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
                    setIsMatchOver(true);
                }


            }).catch(error => {
                console.log(error)
                if (error.response.status === 400) {
                    toast.error(error.response.data.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                    })

                }
            });
    }
    return (
        <Container maxWidth="sm" sx={{ backgroundColor: '#f4f4f4', borderRadius: '8px', padding: '2rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Box mt={4} textAlign="center">
                <Typography variant="h2" gutterBottom sx={{ color: '#333', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Game Begins!</Typography>
                <Button variant="contained" color="primary" onClick={handleMatch} size="large" sx={{ backgroundColor: '#1976d2', color: '#fff', padding: '0.5rem 2rem', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                    Start
                </Button>
                <Box mt={3}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" align="left" sx={{ color: '#666' }}>
                                Remaining lives:
                            </Typography>
                            <Typography variant="h6" align="left" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                                {lives}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" align="left" sx={{ color: '#666' }}>
                                Word:
                            </Typography>
                            <Typography variant="h6" align="left" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                                {obscuredWord}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box mt={2}>
                    <Typography variant="subtitle1" sx={{ color: '#666' }}>Description:</Typography>
                    <Typography variant="h6" sx={{ color: '#444', fontStyle: 'italic' }}>{description}</Typography>
                </Box>
                <Box mt={4}>
                    <TextField
                        variant="outlined"
                        label="Enter a Guess"
                        value={guess}
                        onChange={handleGuesses}
                        error={!!guessError}
                        helperText={guessError}
                        fullWidth
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#ddd',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#1976d2',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1976d2',
                                },
                            },
                        }}
                    />
                </Box>
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={toggleSubmmit}
                        disabled={!isValidGuess}
                        fullWidth
                        sx={{
                            backgroundColor: isValidGuess ? '#1976d2' : '#ddd',
                            color: isValidGuess ? '#fff' : '#666',
                            padding: '0.5rem',
                            borderRadius: '20px',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        Submit
                    </Button>
                </Box>
                <ToastContainer />
                <Box mt={4}>
                    <Button
                        variant="text"
                        onClick={() => navigate("/Mainmenu")}
                        disabled={!isMatchOver}
                        fullWidth
                        sx={{
                            color: isMatchOver ? '#1976d2' : '#bbb',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                        }}
                    >
                        Back to Main Menu
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Gamescreen