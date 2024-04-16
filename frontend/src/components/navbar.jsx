import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import full_logo from './full_logo.svg';

const pages = ['Patient Login', 'Physician Login', 'Profile'];
const links = ['/patients/login', '/physicians/login'];

function Navbar() {
  // const { id } = useParams();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleProfileClick = () => {
    // try{
    const path = window.location.pathname.split('/');
    
    // The ID segment should be at index 2 (assuming the URL format is '/patients/{id}/profile' or '/physicians/{id}/profile')
    const id = path[2];
    // if (id == 'undefined'||id == 'login'){
    //   window.location.href = `/welcome`;
    // }
    // else{
      const userType = path[1] === 'patients' ? 'patient' : 'physician';
    
    // Construct the profile URL based on the extracted ID and user type
      const profileURL = `/${userType}s/${id}/profile`;
      window.location.href = profileURL;
    // }
  };

  return (
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box component="a" href="/">
            <Box component="img" sx={{ display: { height: 50, xs: 'none', md: 'flex' }, mr: 1 }} src={full_logo} alt="logo" />
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
                onClick={() => {
                  if (page === 'Profile') {
                    handleProfileClick();
                  } else {
                    window.location.href = links[i];
                  }
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page === 'Profile' ? 'Profile' : page }
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
