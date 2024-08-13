import { Button, Container, Slide, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios"


function Mainmenu() {
    const token = localStorage.getItem("authToken");
    const [menuChecked, setMenuChecked] = useState(false);
    const [nameChecked, setNameChecked] = useState(false);
    const [rows, setRows] = useState([]);
    const [api, setAPI] = useState();

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
                    >
                        Continue
                    </Button>
                );
            }
        }
    ];





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
        <Container maxWidth="lg">
            <Slide
                direction="down"
                in={menuChecked}
                mountOnEnter
                unmountOnExit
                timeout={{ enter: 1000 }}
            >
                <Typography variant="h3" display={"flex"} >Main menu</Typography>
            </Slide>
            <br />
            <Slide
                direction="right"
                in={nameChecked}
                mountOnEnter
                unmountOnExit
                timeout={{ enter: 500 }}
            >
                <Typography variant="body1" style={{ wordWrap: "break-word" }}>
                    Welcome {firstName} {lastName}
                </Typography>
            </Slide>
            <Slide
                direction="up" in={nameChecked}
                mountOnEnter
                unmountOnExit
                timeout={{ enter: 500 }}
            >
                <Button variant="text" sx={{ border: 2 }} onClick={handleNewMatch} >Create new match </Button>
            </Slide>
            <br />
            <Slide
                direction="up" in={nameChecked}
                mountOnEnter
                unmountOnExit
                timeout={{ enter: 500 }}
            >
                <Button variant="text" sx={{ border: 2 }} onClick={handleAllMatches}>Get current Matches</Button>
            </Slide>
            <br />
            {rows.length > 0 && (
                <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                    />
                </div>
            )}

        </Container>
    );

}

export default Mainmenu;