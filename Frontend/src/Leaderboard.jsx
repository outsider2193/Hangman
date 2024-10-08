import { Button, Box, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useState } from "react";
import axios from "axios";

function Leaderboard() {
    const token = localStorage.getItem("authToken");
    const [rows, setRows] = useState([]);


    const getLeaderBoard = () => {

        axios.get("http://localhost:5000/leaderboard", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const leaderBoardData = response.data.map((player, index) => ({
                    id: index + 1,
                    _id: player._id,
                    name: player.name,
                    score: player.score,
                    total_matches: player.total_matches
                }));
                setRows(leaderBoardData);
                console.log(response.data);
            })

    }

    const columns = [
        { field: '_id', headerName: "PLAYER ID", width: 150 },
        { field: 'name', headerName: "PLAYER NAME", width: 200 },
        { field: 'score', headerName: 'TOTAL SCORE', width: 150 },
        { field: 'total_matches', headerName: 'TOTAL MATCHES', width: 170 }
    ];

    return (
        <Box sx={{ padding: 2 }}>
            <Button
                variant="outlined"
                sx={{
                    display: "block",
                    margin: "10px auto",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.05)" }
                }}
                onClick={getLeaderBoard}
            >
                Fetch Leaderboard
            </Button>



            {rows.length > 0 ? ( 
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]} 
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#e0e0e0"
                            }
                        }}
                    />
                </Box>
            ) : (
                <Typography variant="h6" align="center">No leaderboard data available. Click the button to fetch.</Typography>
            )}
        </Box>
    );
}

export default Leaderboard;
