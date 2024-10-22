import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container } from '@mui/material';
import Navbar from '../Logout';
import axios from 'axios';

const SupervisorDashboard = () => {

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

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
      setTasks(response.data.data);
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


  const handleAssignTask = async () => {

    if (!selectedTask || !selectedEmployee) {
      setError('Por favor selecciona una tarea y un empleado.');
      return;
    }
    try {
      selectedTask.usuarioId = selectedEmployee;
      const response = await axios.put('https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/tareas/Actualizar', selectedTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      fetchTasks();
      setSuccessMessage('Tarea asignada con éxito');
      setOpenDialog(false);
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
      <Navbar title='Panel de control Supervisor' />

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tarea</TableCell>
              <TableCell>Empleado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tareasConUsuario.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.nombre}</TableCell>
                <TableCell>{task.usuarioNombre}</TableCell>
                <TableCell>{task.estadoId === 1 ? 'Pendiente' : task.estadoId === 2 ? 'En proceso' : 'Completada'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedTask(task);
                      setOpenDialog(true);
                    }}>
                    Asignar
                  </Button>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Asignar tarea</DialogTitle>
        <DialogContent>
          <TextField
            select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            fullWidth
            SelectProps={{
              native: true,
            }}
            style={{ marginTop: '10px' }}
          >
            <option value="">Selecciona un empleado</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.nombre}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleAssignTask} color="primary">Asignar</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar errores o éxito */}
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

export default SupervisorDashboard;
