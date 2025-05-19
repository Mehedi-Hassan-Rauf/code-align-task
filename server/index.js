const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'PUT', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

let tasks = [];
let idCounter = 1;

app.get('/api/tasks', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || '';

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalTasks = filteredTasks.length;
  const totalPages = Math.ceil(totalTasks / limit);
  const startIndex = (page - 1) * limit;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + limit);

  res.json({
    tasks: paginatedTasks,
    totalPages,
    currentPage: page,
  });
});

app.post('/api/tasks', (req, res) => {
  const task = {
    id: idCounter++,
    ...req.body,
  };
  tasks.push(task);
  io.emit('taskUpdate');
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    io.emit('taskUpdate');
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('taskUpdate', () => {
    io.emit('taskUpdate');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});