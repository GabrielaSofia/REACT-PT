import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from '@mui/material';
import Navbar from '../Logout';
import axios from 'axios';

const AdminDashboard = () => {


  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [userData, setUserData] = useState({ nombre: '', email: '', contraseña: '', rolId: '' });
  const [taskData, setTaskData] = useState({ nombre: '', estadoId: '', usuarioId: '', id: '' });

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/usuario/Todos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setUsers(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

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

  const openUserForm = (user = null) => {
    setCurrentUser(user);
    setUserData(user ? { nombre: user.nombre, email: user.email, contraseña: '', rolId: user.rolId } : { nombre: '', email: '', contraseña: '', rolId: '' });
    setOpenUserDialog(true);
  };

  const openTaskForm = (task = null) => {
    setCurrentTask(task);
    setTaskData(task ? { nombre: task.nombre, estadoId: task.estadoId, usuarioId: task.usuarioId, id: task.id } : { nombre: '', estadoId: '', usuarioId: '', id: '' });
    setOpenTaskDialog(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (!userData.nombre || !userData.email) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const url = currentUser ? `https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/usuario/Actualizar` : 'https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/usuario/Crear';

      if (currentUser) {
        currentUser.email = userData.email;
        currentUser.nombre = userData.nombre;
        currentUser.rolId = userData.rolId;
        const response = await axios.put(url, currentUser, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
      } else {
        const response = await axios.post(url, userData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
      }

      fetchUsers();
      setOpenUserDialog(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    if (!taskData.nombre || !taskData.estadoId) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const url = currentTask ? `https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/tareas/Actualizar` : 'https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/tareas/Crear';

      if (currentTask) {
        currentTask.nombre = taskData.nombre;
        currentTask.estadoId = taskData.estadoId;
        const response = await axios.put(url, currentTask, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
      } else {
        taskData.usuarioId = "1";
        const data = {
          "nombre": taskData.nombre,
          "estadoId": taskData.estadoId,
          "usuarioId": taskData.usuarioId
        }
        const response = await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
      }

      fetchTasks();
      setOpenTaskDialog(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {

        const response = await axios.delete(`https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/usuario/Eliminar/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        fetchUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {

        const response = await axios.delete(`https://dvp-webapp-01-fhaacxhneba6eyah.canadacentral-01.azurewebsites.net/api/v1/tareas/Eliminar/${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        fetchTasks();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Container>
      <Navbar title='Panel de control Administrador' />

      <Button style={{ margin: '20px 10px' }} variant="contained" color="primary" onClick={() => openUserForm()}>
        Agregar Usuario
      </Button>
      <Button style={{ margin: '20px 10px' }} variant="contained" color="primary" onClick={() => openTaskForm()}>
        Agregar Tarea
      </Button>

      {/* Tabla de Usuarios */}
      <Typography variant="h5" gutterBottom>
        Usuarios
      </Typography>
      {users.length === 0 ? (
        <Typography variant="body1">No hay usuarios disponibles.</Typography>
      ) : (
        <TableContainer component={Paper} style={{ marginBottom: '40px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.nombre}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell style={{
                    display: 'flex',
                    justifyContent: 'space-evenly'
                  }}>
                    <Button variant="contained" color="primary" onClick={() => openUserForm(user)}>
                      Editar
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleUserDelete(user.id)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tabla de Tareas */}
      <Typography variant="h5" gutterBottom>
        Tareas
      </Typography>
      {tasks.length === 0 ? (
        <Typography variant="body1">No hay tareas disponibles.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.nombre}</TableCell>
                  <TableCell>{task.estadoId === 1 ? 'Pendiente' : task.estadoId === 2 ? 'En proceso' : 'Completada'}</TableCell>
                  <TableCell style={{
                    display: 'flex',
                    justifyContent: 'space-evenly'
                  }}>
                    <Button variant="contained" color="primary" onClick={() => openTaskForm(task)}>
                      Editar
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleTaskDelete(task.id)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={!!error}
        message={error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      />

      <Dialog open={openUserDialog} onClose={() => { setOpenUserDialog(false); setError(null); }}>
        <DialogTitle>{currentUser ? 'Editar usuario' : 'Agregar usuario'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            value={userData.nombre}
            onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            value={userData.contraseña}
            onChange={(e) => setUserData({ ...userData, contraseña: e.target.value })}
          />

          <TextField
            select
            margin="normal"
            required
            label="Rol"
            fullWidth
            id="role-select"
            value={userData.rolId}
            onChange={(e) => setUserData({ ...userData, rolId: e.target.value })}
          >
            <MenuItem value="">Selecciona un rol</MenuItem>
            <MenuItem value={1}>Administrador</MenuItem>
            <MenuItem value={2}>Supervisor</MenuItem>
            <MenuItem value={3}>Empleado</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenUserDialog(false); setError(null); }} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleUserSubmit} color="primary">
            {currentUser ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)}>
        <DialogTitle>{currentTask ? 'Editar tarea' : 'Agregar tarea'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            value={taskData.nombre}
            onChange={(e) => setTaskData({ ...taskData, nombre: e.target.value })}
          />

          <TextField
            select
            margin="dense"
            label="Estado"
            fullWidth
            value={taskData.estadoId}
            onChange={(e) => setTaskData({ ...taskData, estadoId: e.target.value })}
          >
            <MenuItem value="">Selecciona un estado</MenuItem>
            <MenuItem value={1}>Pendiente</MenuItem>
            <MenuItem value={2}>En Proceso</MenuItem>
            <MenuItem value={3}>Completada</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleTaskSubmit} color="primary">
            {currentTask ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
