import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Import Models
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';
import Comment from './models/Comment.js';
import Notification from './models/Notification.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Connect to Database
connectDB();

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
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'your_jwt_secret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'your_jwt_secret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().populate('members', 'name avatar');
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/projects', async (req, res) => {
  const { name, description, members, createdBy } = req.body;
  try {
    const newProject = new Project({
      name,
      description,
      members,
      createdBy
    });

    const project = await newProject.save();
    io.emit('project-created', project);
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });

    project = await Project.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    
    io.to(`project-${req.params.id}`).emit('project-updated', project);
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Tasks
app.get('/api/tasks', async (req, res) => {
  const { projectId } = req.query;
  try {
    const filter = projectId ? { projectId } : {};
    const tasks = await Task.find(filter).populate('assigneeId', 'name avatar');
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const task = await newTask.save();
    
    io.to(`project-${task.projectId}`).emit('task-created', task);
    
    // Create notification
    if (task.assigneeId) {
      const notification = new Notification({
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You've been assigned to "${task.title}"`,
        userId: task.assigneeId,
      });
      await notification.save();
      io.to(`user-${task.assigneeId}`).emit('notification', notification);
    }
    
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    
    io.to(`project-${task.projectId}`).emit('task-updated', task);
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Comments
app.get('/api/tasks/:taskId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId }).populate('userId', 'name avatar');
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/tasks/:taskId/comments', async (req, res) => {
  const { content, userId, projectId } = req.body;
  try {
    const newComment = new Comment({
      content,
      userId,
      taskId: req.params.taskId
    });

    const comment = await newComment.save();
    
    io.to(`project-${projectId}`).emit('comment-added', comment);
    res.status(201).json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Notifications
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});