import { Button, Container, Fade, Typography, Box, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Mainmenu() {
    const token = localStorage.getItem("authToken");
    const [menuChecked, setMenuChecked] = useState(false);
    const [nameChecked, setNameChecked] = useState(false);
    const [rows, setRows] = useState([]);
    const [api, setAPI] = useState();
    const [gameDifficulty, setDifficulty] = useState('medium');
    const navigate = useNavigate();

    useEffect(() => {
        const menuTimeout = setTimeout(() => {
            setMenuChecked(true);
        }, 300);

        const nameTimeout = setTimeout(() => {
            setNameChecked(true);
        }, 600);

        return () => {
            clearTimeout(menuTimeout);
            clearTimeout(nameTimeout);
        };
    }, []);

    function matchStatus(status) {
        return status !== "running";
    }

    function handleNewMatch() {
        axios.get(`http://localhost:5000/match/new/${gameDifficulty}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setAPI(response.data);
            handleAllMatches();
        });
    }

    const arrayToken = token.split('.');
    const decodedToken = JSON.parse(atob(arrayToken[1]));
    const firstName = decodedToken.firstName;
    const lastName = decodedToken.lastName;
    const role = decodedToken.role;

    function handleAllMatches() {
        axios.get("http://localhost:5000/match", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            const matchData = response.data.map((match, index) => ({
                id: index + 1,
                matchId: match._id,
                name: firstName,
                status: match.status,
                word: match.word,
                lives: match.remaining_lives
            }));
            setRows(matchData);
        });
    }

    const columns = [
        { field: 'matchId', headerName: "MATCH ID", width: 100 },
        { field: 'name', headerName: "PLAYER NAME", width: 200 },
        { field: 'status', headerName: "STATUS", width: 150 },
        { field: 'word', headerName: 'WORD', width: 150 },
        { field: 'lives', headerName: 'REMAINING LIVES', width: 170 },
        {
            field: 'action',
            headerName: 'ACTION',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    disabled={matchStatus(params.row.status)}
                    onClick={() => navigate(`/game/${params.row.matchId}`)}
                >
                    Continue
                </Button>
            )
        }
    ];

    function handleWordManagement() {
        if (role === "admin") {
            navigate("/wordManagement");
        }
    }

    function goToLeaderBoard() {
        navigate("/leaderboard");
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
                backgroundColor: "#1e1e2d", // Darker background for a game-like feel
                padding: 3,
            }}
        >
            <Card sx={{
                maxWidth: "800px",
                width: "100%",
                padding: 3,
                boxShadow: 3,
                backgroundColor: "#27293d", // Card background
                color: "#fff" // Text color for better contrast
            }}>
                <CardContent>
                    <Container maxWidth="lg">
                        <Fade in={menuChecked} timeout={1000}>
                            <Typography variant="h3" align="center" sx={{ fontWeight: "bold", color: "#f2a365" }}>
                                Main Menu
                            </Typography>
                        </Fade>
                        <Fade in={nameChecked} timeout={1500}>
                            <Typography variant="h6" align="center" sx={{ color: "#eaeaea" }}>
                                Welcome, {firstName} {lastName}
                            </Typography>
                        </Fade>

                        {/* Flexbox Container for alignment */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                marginTop: 4,
                            }}
                        >
                            {/* Button Group */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2, // gap between buttons
                                    alignItems: "center",
                                    width: "100%"
                                }}
                            >
                                <Fade in={nameChecked} timeout={2000}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: '50%',
                                            backgroundColor: "#f2a365",
                                            "&:hover": { backgroundColor: "#d98c54" }, // Hover effect
                                        }}
                                        onClick={handleNewMatch}
                                    >
                                        Create New Match
                                    </Button>
                                </Fade>
                                <Fade in={nameChecked} timeout={2500}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: '50%',
                                            backgroundColor: "#f2a365",
                                            "&:hover": { backgroundColor: "#d98c54" } // Hover effect
                                        }}
                                        onClick={handleAllMatches}
                                    >
                                        Get Current Matches
                                    </Button>
                                </Fade>
                                <Fade in={nameChecked} timeout={3000}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            width: '50%',
                                            borderColor: "#f2a365",
                                            color: "#f2a365",
                                            "&:hover": { backgroundColor: "#f2a365", color: "#fff" } // Hover effect
                                        }}
                                        onClick={goToLeaderBoard}
                                    >
                                        Go to Leaderboard
                                    </Button>
                                </Fade>
                            </Box>

                            {/* Difficulty Select and Word Management Button */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    marginTop: 4,
                                }}
                            >
                                <FormControl sx={{ width: 200 }}>
                                    <InputLabel id="difficulty" sx={{ color: "#fff" }}>Select Difficulty</InputLabel>
                                    <Select
                                        labelId="difficulty"
                                        id="difficulty-select"
                                        value={gameDifficulty}
                                        label="Select Difficulty"
                                        onChange={(event) => setDifficulty(event.target.value)}
                                        sx={{ color: "#fff", borderColor: "#fff" }}
                                    >
                                        <MenuItem value="easy">Easy</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="hard">Hard</MenuItem>
                                    </Select>
                                </FormControl>

                                {role === "admin" && (
                                    <Fade in={nameChecked} timeout={3500}>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#f2a365",
                                                "&:hover": { backgroundColor: "#d98c54" }, // Hover effect
                                            }}
                                            onClick={handleWordManagement}
                                        >
                                            Word Management
                                        </Button>
                                    </Fade>
                                )}
                            </Box>
                        </Box>

                        {/* Data Grid for Current Matches */}
                        {rows.length > 0 && (
                            <Box sx={{ height: 600, width: '100%', marginTop: 4 }}>
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
                                            backgroundColor: "#2f2f3f",
                                            color: "#1e1e2d"
                                        },
                                        "& .MuiDataGrid-cell": {
                                            color: "#fff"
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </Container>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Mainmenu;
