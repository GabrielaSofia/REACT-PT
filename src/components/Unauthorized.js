// Unauthorized.js
import { Container, Typography } from '@mui/material';
import React from 'react';

const Unauthorized = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                No tiene el rol asignado para acceder a esta ruta
            </Typography>
        </Container>
    );
};

export default Unauthorized;
