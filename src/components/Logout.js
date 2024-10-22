// components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ title = '' }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <AppBar position="static" style={{ marginBottom: '30px' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                    Cerrar Sesión
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
