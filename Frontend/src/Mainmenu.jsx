import { Button, Container, Slide, Typography, Box, Card, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import axios from "axios"


function Mainmenu() {
    const token = localStorage.getItem("authToken");
    const [menuChecked, setMenuChecked] = useState(false);
    const [nameChecked, setNameChecked] = useState(false);
    const [rows, setRows] = useState([]);
    const [api, setAPI] = useState();
    // const [playerRole, setRole] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const menuTimeout = setTimeout(() => {
            setMenuChecked(true);
        }, 500);

        const nameTimeout = setTimeout(() => {
            setNameChecked(true);
        }, 1000);

        return () => {
            clearTimeout(menuTimeout);
            clearTimeout(nameTimeout);
        };
    }, []);

    // useEffect(() => {
    //     if (!role == "admin") {
    //         setRole(false);
    //     }
    //     else {
    //         setRole(true);
    //     }
    // }, [playerRole]);

    function matchStatus(status) {
        return status !== "running";
    }
    function handleNewMatch() {
        axios.get("http://localhost:5000/match/new", {
            headers: {
                Authorization: `Bearer ${token}`

            }
        }).then(response => {
            setAPI(response.data);
            console.log(response.data);
        })

    }

    const arrayToken = token.split('.');
    const decodedToken = JSON.parse(atob(arrayToken[1]));
    const firstName = decodedToken.firstName;
    const lastName = decodedToken.lastName;
    const role = decodedToken.role;
    console.log(decodedToken)


    function handleAllMatches() {
        axios.get("http://localhost:5000/match", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            const matchData = response.data.map((match, index) => ({
                id: index + 1,
                matchId: match.id,
                name: firstName,
                status: match.status,
                word: match.word,
                lives: match.remaining_lives
            }));
            setRows(matchData)
        })

    }
    const columns = [

        { field: 'matchId', headerName: "MATCH ID", width: 100 },
        { field: 'name', headerName: "PLAYER NAME", width: 200 },
        { field: 'status', headerName: "STATUS", width: 150 },
        { field: 'word', headerName: 'word', width: 150 },
        { field: 'lives', headerName: 'REMAINING LIVES', width: 170 },
        {
            field: 'action',
            headerName: 'ACTION',
            width: 150,
            renderCell: (params) => {
                return (
                    <Button
                        variant="text"
                        color="primary"
                        disabled={matchStatus(params.row.status)}
                        onClick={() => {
                            navigate(`/game/${params.row.matchId}`)
                        }}

                    >
                        Continue
                    </Button>
                );
            }
        }
    ];


    function handleWordManagement() {
        if (role === "admin") {
            navigate("/wordManagement");
        }

    }

    if (!token) {
        return (
            <Container maxWidth='sm'>

                <Typography variant="body2" style={{ wordWrap: "break-word" }}>
                    No authentication token found.
                </Typography>
            </Container>
        );
    }



    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f2f5", // Subtle background color
                padding: 3,
            }}
        >
            <Card sx={{ maxWidth: "800px", width: "100%", padding: 3, boxShadow: 3 }}>
                <CardContent>
                    <Container maxWidth="lg">
                        <Slide
                            direction="down"
                            in={menuChecked}
                            mountOnEnter
                            unmountOnExit
                            timeout={{ enter: 1000 }}
                        >
                            <Typography variant="h3" align="center" sx={{ fontWeight: "bold" }}>
                                Main Menu
                            </Typography>
                        </Slide>
                        <br />
                        <Slide
                            direction="right"
                            in={nameChecked}
                            mountOnEnter
                            unmountOnExit
                            timeout={{ enter: 500 }}
                        >
                            <Typography variant="h6" align="center">
                                Welcome, {firstName} {lastName}
                            </Typography>
                        </Slide>
                        <br />
                        <Slide
                            direction="up" in={nameChecked}
                            mountOnEnter
                            unmountOnExit
                            timeout={{ enter: 500 }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    display: "block",
                                    margin: "10px auto",
                                    transition: "transform 0.2s",
                                    "&:hover": { transform: "scale(1.05)" }
                                }}
                                onClick={handleNewMatch}
                            >
                                Create New Match
                            </Button>
                        </Slide>
                        <Slide
                            direction="up" in={nameChecked}
                            mountOnEnter
                            unmountOnExit
                            timeout={{ enter: 500 }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    display: "block",
                                    margin: "10px auto",
                                    transition: "transform 0.2s",
                                    "&:hover": { transform: "scale(1.05)" }
                                }}
                                onClick={handleAllMatches}
                            >
                                Get Current Matches
                            </Button>
                        </Slide>
                        <br />
                        {rows.length > 0 && (
                            <Box sx={{ height: 600, width: '100%' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 5 },
                                        },
                                    }}
                                    sx={{
                                        "& .MuiDataGrid-columnHeaders": {
                                            backgroundColor: "#e0e0e0"
                                        }
                                    }}
                                />
                            </Box>
                        )}
                        <br />
                        {role === "admin" && (
                            <Slide
                                direction="up" in={nameChecked}
                                mountOnEnter
                                unmountOnExit
                                timeout={{ enter: 500 }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{
                                        display: "block",
                                        margin: "10px auto",
                                        transition: "transform 0.2s",
                                        "&:hover": { transform: "scale(1.05)" }
                                    }}
                                    onClick={handleWordManagement}
                                >
                                    Word Management
                                </Button>
                            </Slide>
                        )}
                    </Container>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Mainmenu;