import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Typography, Container } from '@mui/material';
import Navbar from '../Logout';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const EmployeeDashboard = () => {

  const [tasks, setTasks] = useState([]); 
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  const [successMessage, setSuccessMessage] = useState(null);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);


  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/tareas/Todas', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
    let tasksFilter = response.data.data.filter(item => item.usuarioId.toString() === decoded.nameid);
    setTasks(tasksFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/usuario/Todos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setEmployees(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangeStatus = async (taskId, nombre, estadoId, usuarioId) => {
    try {

      let data = {
        "id": taskId,
        "nombre": nombre,
        "estadoId": estadoId,
        "usuarioId": usuarioId
      }
      const response = await axios.put('https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/tareas/Actualizar', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      fetchTasks();
      setSuccessMessage('Estado de la tarea actualizado con éxito');
    } catch (err) {
      setError(err.message);
    }
  };

  const tareasConUsuario = tasks.map((tarea) => {
    const usuario = employees.find((user) => user.id === tarea.usuarioId);
    return {
      ...tarea,
      usuarioNombre: usuario ? usuario.nombre : 'Usuario no encontrado',
    };
  });

  return (
    <Container>
      <Navbar title='Panel de control empleado'/>

      {tasks.length > 0 ? (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>

                <TableCell>Usuario</TableCell>
                <TableCell>Tarea</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tareasConUsuario.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.usuarioNombre}</TableCell>
                  <TableCell>{task.nombre}</TableCell>
                  <TableCell>{task.estadoId === 1 ? 'Pendiente': task.estadoId === 2 ? 'En proceso' : 'Completada'}</TableCell>
                  <TableCell>
                  {task.estadoId !== 3 && <Button
                    variant="outlined"
                    color="success"
                    onClick={() => handleChangeStatus(task.id, task.nombre, 3, task.usuarioId)}
                    style={{ marginLeft: '10px' }}>
                    Marcar como Completada
                  </Button>}
                  {task.estadoId !== 1 && <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleChangeStatus(task.id, task.nombre, 1, task.usuarioId)}
                    style={{ marginLeft: '10px' }}>
                    Marcar como Pendiente
                  </Button>}
                  {task.estadoId !== 2 && <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleChangeStatus(task.id, task.nombre, 2, task.usuarioId)}
                    style={{ marginLeft: '10px' }}>
                    Marcar como En proceso
                  </Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          No tienes tareas asignadas
        </Typography>
      )}

      <Snackbar
        open={!!error}
        message={error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      />
      <Snackbar
        open={!!successMessage}
        message={successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      />
    </Container>
  );
};

export default EmployeeDashboard;
