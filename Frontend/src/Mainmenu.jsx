import { Button, Container, Slide, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios"


function Mainmenu() {
    const token = localStorage.getItem("authToken");

    const [menuChecked, setMenuChecked] = useState(false);
    const [nameChecked, setNameChecked] = useState(false);
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

    function handleMatch() {
        axios.get("http://localhost:5000/match/new", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setAPI(response.data);
            console.log(response.data);
        })
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
    const arrayToken = token.split('.');
    const decodedToken = JSON.parse(atob(arrayToken[1]));
    const firstName = decodedToken.firstName;
    const lastName = decodedToken.lastName;

    return (
        <Container maxWidth="sm">
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
                <Button variant="text" sx={{ border: 2 }} onClick={handleMatch} >Create new match</Button>
            </Slide>
        </Container>
    );

}

export default Mainmenu;