import { Button, Container, TextField, Typography } from "@mui/material"
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
        <Container>
            <Typography variant="h2" display={"flex"}>Game Begins !</Typography>
            <Button variant="contained" onClick={handleMatch}>Start</Button>
            <Typography variant="subtitle1">remaining lives:{lives}</Typography>
            <Typography variant="subtitle1">word:{obscuredWord}</Typography>
            <Typography variant="subtitle1">Description:{description}</Typography>
            <br />
            <TextField variant="outlined" label="Enter a Guess" value={guess} onChange={handleGuesses} ></TextField>
            {guessError && <p style={{ color: 'red' }}>{guessError}</p>}
            <br />
            <Button variant="contained" onClick={toggleSubmmit} disabled={!isValidGuess} >Submit </Button>
            <ToastContainer />
            <br />
            <Button variant="text" sx={{ alignContent: "center" }} onClick={() => navigate("/Mainmenu")} disabled={!isMatchOver} >Back to Main Menu</Button>
        </Container>
    )
}

export default Gamescreen