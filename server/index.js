import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Mock data store
let users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: '2', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'member' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'member' }
];

let projects = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    status: 'active',
    progress: 65,
    members: ['1', '2', '3'],
    createdBy: '1'
  }
];

let tasks = [
  {
    id: 'task-1',
    title: 'Design Homepage Layout',
    description: 'Create wireframes and mockups',
    status: 'completed',
    priority: 'high',
    assigneeId: '2',
    projectId: 'proj-1'
  }
];

let notifications = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their personal room for notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
  });

  // Join project room for real-time updates
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
  });

  // Handle task updates
  socket.on('task-updated', (data) => {
    // Broadcast to all users in the project
    socket.to(`project-${data.projectId}`).emit('task-updated', data);
  });

  // Handle new comments
  socket.on('comment-added', (data) => {
    socket.to(`project-${data.projectId}`).emit('comment-added', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API Routes

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication - in real app, verify credentials
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ user, token: 'mock-jwt-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    role: 'member'
  };
  
  users.push(newUser);
  res.json({ user: newUser, token: 'mock-jwt-token' });
});

// Projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  projects.push(newProject);
  
  // Notify all project members
  io.emit('project-created', newProject);
  
  res.json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const projectIndex = projects.findIndex(p => p.id === req.params.id);
  if (projectIndex !== -1) {
    projects[projectIndex] = { ...projects[projectIndex], ...req.body };
    
    // Notify project members
    io.to(`project-${req.params.id}`).emit('project-updated', projects[projectIndex]);
    
    res.json(projects[projectIndex]);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Tasks
app.get('/api/tasks', (req, res) => {
  const { projectId } = req.query;
  let filteredTasks = tasks;
  
  if (projectId) {
    filteredTasks = tasks.filter(t => t.projectId === projectId);
  }
  
  res.json(filteredTasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  // Notify project members and assignee
  io.to(`project-${newTask.projectId}`).emit('task-created', newTask);
  
  if (newTask.assigneeId) {
    const notification = {
      id: Date.now().toString(),
      type: 'task_assigned',
      title: 'New Task Assigned',
      message: `You've been assigned to "${newTask.title}"`,
      userId: newTask.assigneeId,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    notifications.push(notification);
    io.to(`user-${newTask.assigneeId}`).emit('notification', notification);
  }
  
  res.json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { 
      ...tasks[taskIndex], 
      ...req.body, 
      updatedAt: new Date().toISOString() 
    };
    
    // Notify project members
    io.to(`project-${tasks[taskIndex].projectId}`).emit('task-updated', tasks[taskIndex]);
    
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Notifications
app.get('/api/notifications/:userId', (req, res) => {
  const userNotifications = notifications.filter(n => n.userId === req.params.userId);
  res.json(userNotifications);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const notificationIndex = notifications.findIndex(n => n.id === req.params.id);
  if (notificationIndex !== -1) {
    notifications[notificationIndex].read = true;
    res.json(notifications[notificationIndex]);
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

// File upload endpoint (mock)
app.post('/api/upload', (req, res) => {
  // In a real app, handle file upload to cloud storage
  res.json({
    id: Date.now().toString(),
    name: 'uploaded-file.pdf',
    url: 'https://example.com/file.pdf',
    size: 1024000,
    type: 'application/pdf'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});