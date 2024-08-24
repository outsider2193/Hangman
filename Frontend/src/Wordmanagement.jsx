import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios"
import { useState, useEffect } from "react";

function Wordmanagement() {
    const token = localStorage.getItem("authToken");
    const [rows, setRows] = useState([]);
    const [del, setDelete] = useState();
    const [word, setWord] = useState("");
    const [wordError, setWordError] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);

    function openDialog() {
        setOpen(true);
    }
    function closeDialog() {
        setOpen(false);
        setWordError("");
    }

    useEffect(() => {
        handleWords();
    }, []);

    function handleWords() {
        axios.get("http://localhost:5000/words", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            const matchWords = response.data.map((match, index) => ({
                id: index + 1,
                word: match.word,
                description: match.description
            }));
            console.log(matchWords);
            setRows(matchWords);
        })
    }
    const columns = [
        { field: 'word', headerName: "WORD", width: 100 },
        { field: "description", headerName: "DESCRIPTION", width: 300 },
        {
            field: "action", headerName: "DELETE WORDS", width: 200,
            renderCell: (params) => {
                return (
                    <Button variant="text" onClick={() => deleteWords(params.row.word)}>DELETE</Button>
                )
            }
        }
    ];

    function deleteWords(word) {
        axios.delete(`http://localhost:5000/words/${word}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setDelete(response.data);
            console.log(response.data.message);
            handleWords();

        });
    }

    const isValid = /^[a-z]{3,}$/;
    function validateWord(event) {
        const value = event.target.value;
        setWord(value);
        const wordExists = rows.some(row => row.word === value);
        if (wordExists) {
            setWordError("Word Already exists!")
        }
        else if (!isValid.test(value)) {
            setWordError("Invalid")
        }

        else {
            setWordError("")
        }


    }
    function addDescription(event) {
        const value = event.target.value;
        setDescription(value);
    }

    function addWords() {
        const data = {
            word: word,
            description: description
        }
        axios.post("http://localhost:5000/words", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setWord(response.data);
            console.log(response.data);
            setWord("");
            setDescription("");
            closeDialog();
            handleWords();
        })
    }



    return (
        <Container maxWidth="lg">


            <Button variant="contained" sx={{ alignContent: "center" }} onClick={handleWords} >Get existing words</Button>
            <br /> <br />

            <Button variant="contained" onClick={openDialog} sx={{ marginBottom: 2 }}>Add Words</Button>
            <Dialog
                open={open}
                onClose={closeDialog}
                fullWidth maxWidth="sm"
            >
                <DialogTitle>Add new word</DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        The Word Must be Atleast 3 characters long,
                        Only English Alphabet words,
                        Word MUST be in Lowercase,
                        Word must not be same as previous
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        variant="outlined"
                        label="add word"
                        value={word}
                        onChange={validateWord}
                    />
                    {wordError && <p style={{ color: 'red' }}>{wordError}</p>}
                    <TextField
                        autoFocus
                        margin="dense"
                        variant="outlined"
                        label="add description"
                        value={description}
                        onChange={addDescription}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button variant="contained" onClick={addWords}>Add</Button>
                </DialogActions>

            </Dialog>


            {rows.length > 0 && (
                <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                        rows={rows} columns={columns} initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                    />
                </div>
            )}

        </Container>
    )
}

export default Wordmanagement;