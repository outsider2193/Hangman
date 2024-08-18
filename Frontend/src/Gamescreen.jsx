import { Button, Container, TextField, Typography } from "@mui/material"
import axios from "axios"
import { useState } from "react";
import { useParams } from "react-router";
import { ToastContainer, toast, Bounce } from 'react-toastify';

function Gamescreen() {
    const token = localStorage.getItem("authToken");
    const [api, setApi] = useState();
    const [obscuredWord, setObscuredword] = useState();
    const [lives, setLives] = useState();
    const [description, setDescription] = useState();
    const [guess, setGuess] = useState();
    const [guessError, setError] = useState();
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

    const isValid = /^[a-z]$/;

    function handleGuesses(event) {
        const value = event.target.value;
        setGuess(value);
        if (!isValid.test(value)) {
            setError("Invalid format!")

        }
        else {
            setError("");

        }
    }


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
                console.log(response.data);
                if (response.data.message === "correct guess") {
                    toast.success("Correct guess", {
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
           
            }).catch(error => {
                if (error.response.status === 400) {
                    toast.error("already guessed", {
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
            })
       
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
            <Button variant="contained" onClick={toggleSubmmit}>Submit </Button>
            <ToastContainer />
        </Container>
    )
}

export default Gamescreen