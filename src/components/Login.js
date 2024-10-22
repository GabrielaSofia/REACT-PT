import React, { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Container, TextField, Button, Box, Avatar, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    localStorage.clear();

    try {
      const response = await axios.post('https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/usuario/Login', {
        "nombre": '',
        "contraseña": password,
        "email": email,
      });

      const data = response;
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('rol', response.data.data.rolId);

      let userRole = localStorage.getItem("rol");
      if (userRole === "1") {
        navigate('/admin');
      } else if (userRole === "2") {
        navigate('/supervisor');
      } else if (userRole === "3") {
        navigate('/employee');
      }
      setSuccess(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
      setSuccess(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            type='email'
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Box>


    </Container>
  );
};

export default Login;
