import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
// import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
// import dermascope_logo from './dermascope_logo.svg';
import full_logo from './full_logo.svg';
import {api} from '../components/api';

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [username, setUsername] = useState("");
  const [loginState, setLoginState] = useState("");
  const [uid, setUid] = useState("");
  const [pages, setPages] = useState([]);
  const [links, setLinks] = useState([]);
  const [iconLink, setIconLink] = useState("/");

  useEffect(() => {
    api.get("/auth").then((response) => {
      if(response.data.username){
        setUsername(response.data.username);
      }
      if(response.data.state){
        setLoginState(response.data.state);
      }
      if(response.data.uid){
        setUid(response.data.uid);
      }
    }).then(() => {
      if ( loginState == "patient") {
        setPages(['Patient Home', "Physician Login", "Logout"]);
        setLinks(['/patients/' + uid + "/", '/physicians/login', '/logout']);
        setIconLink('/patients/' + uid + "/");
      }
      else if ( loginState == "physician") {
        setPages(['Physician Home', "Patient Login", "Logout"]);
        setLinks(['/physicians/' + uid + "/", '/patients/login', '/logout']);
        setIconLink('/physicians/' + uid + "/");
      }
      else {
        setPages([]);
        setLinks([]);
        setIconLink("/");
      }
    });
  }, [loginState, username, uid])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  let login_status = ""
  if (loginState) {
    login_status += loginState + ": ";
  }
  if (username) {
    login_status += username
  }
  else {
    login_status = (<a href="/"> Welcome! Please log in. </a>)
  }

  return (
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box component="a" href="/">
            <Box component="img" sx={{ display: { height: 50, xs: 'none', md: 'flex'}, mr: 1 }} src={full_logo} alt="logo"/>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
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
                <MenuItem key={page} onClick = {() => {window.location.href = links[i]}}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, i) => (
              <Button
                key={page}
                onClick = {() => {window.location.href = links[i]}}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
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