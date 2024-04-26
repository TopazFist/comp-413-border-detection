// React component for the Navbar that provides navigation links and menu options based
// on the user's login state, as well as displays the user's login status.

import { useState, useEffect } from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import full_logo from "./full_logo.svg";
import { api } from "../components/api";

function Navbar() {
  // State variables for user information and navigation links
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [username, setUsername] = useState("");
  const [loginState, setLoginState] = useState("");
  const [uid, setUid] = useState("");
  const [pages, setPages] = useState([]);
  const [links, setLinks] = useState([]);
  const [iconLink, setIconLink] = useState("/");

  // Effect to fetch user information and set navigation links based on login state
  useEffect(() => {
    api.get("/auth").then((response) => {
      if (response.data.username) {
        setUsername(response.data.username);
      }
      if (response.data.state) {
        setLoginState(response.data.state);
      }
      if (response.data.uid) {
        setUid(response.data.uid);
      }
    }).then(() => {
      // Determine the user's role and set appropriate navigation links
      if (loginState == "patient") {
        setPages(['Patient Home', "Physician Login", "Profile","Logout"]);
        setLinks(['/patients/' + uid + "/", '/physicians/login','/patients/' + uid + "/profile/", '/logout']);
        setIconLink('/patients/' + uid + "/");
      }
      else if (loginState == "physician") {
        setPages(['Physician Home', "Patient Login", "Profile", "Logout"]);
        setLinks(['/physicians/' + uid + "/", '/patients/login','/physicians/' + uid + "/profile/", '/logout']);
        setIconLink('/physicians/' + uid + "/");
      }
      else if (loginState == "nurse") {
        setPages(["Nurse Home", "Patient Login", "Logout"]);
        setLinks(["/nurses/" + uid + "/", '/patients/login', '/logout']);
        setIconLink('/nurses/' + uid + "/");
      }
      else {
        setPages(["Login"]);
        setLinks(["/"]);
        setIconLink("/");
      }
    });
  }, [loginState, username, uid])

  // Open the navigation menu
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // Close the navigation menu
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // Generate login status message based on user's login state and username
  let login_status = "";
  if (loginState) {
    login_status += loginState + ": ";
  }
  if (username) {
    login_status += username;
  }
  else {
    login_status = (<a href="/"> Welcome! Please log in. </a>);
  }

  // Render the Navbar component
  return (
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box component="a" href={iconLink}>
            <Box
              component="img"
              sx={{ display: { height: 50, xs: 'none', md: 'flex' }, mr: 1 }}
              src={full_logo}
              alt="logo"
            />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, i) => (
                <MenuItem key={page} onClick={() => { window.location.href = links[i] }}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, i) => (
              <Button
                key={page}
                onClick={() => { window.location.href = links[i] }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page === 'Profile' ? 'Profile' : page }
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <p>{login_status}</p>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
