import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Project, Task, Notification, User } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  users: User[];
  notifications: Notification[];
  loading: boolean;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  useEffect(() => {
    if (user && token) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [projectsRes, tasksRes, usersRes] = await Promise.all([
            fetch('http://localhost:3001/api/projects', { headers: getAuthHeaders() }),
            fetch('http://localhost:3001/api/tasks', { headers: getAuthHeaders() }),
            fetch('http://localhost:3001/api/users', { headers: getAuthHeaders() }),
          ]);
          if (projectsRes.ok) setProjects(await projectsRes.json());
          if (tasksRes.ok) setTasks(await tasksRes.json());
          if (usersRes.ok) setUsers(await usersRes.json());
        } catch (error) { 
          console.error("Failed to fetch initial data", error); 
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (!user) {
      setLoading(false);
    }
  }, [user, token]);

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const res = await fetch('http://localhost:3001/api/projects', {
      method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(projectData)
    });
    if (res.ok) {
      const newProject = await res.json();
      setProjects(prev => [...prev, newProject]);
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    const res = await fetch(`http://localhost:3001/api/projects/${id}`, {
      method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(projectData)
    });
    if (res.ok) {
      const updated = await res.json();
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
    }
  };

  const deleteProject = async (id: string) => {
    const res = await fetch(`http://localhost:3001/api/projects/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (res.ok) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };
  
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch('http://localhost:3001/api/tasks', {
      method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(taskData)
    });
    if (res.ok) {
      const newTask = await res.json();
      setTasks(prev => [...prev, newTask]);
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    const res = await fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(taskData)
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    }
  };

  const deleteTask = async (id: string) => {
    const res = await fetch(`http://localhost:3001/api/tasks/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (res.ok) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const res = await fetch('http://localhost:3001/api/notifications', {
      method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(notificationData)
    });
    if (res.ok) {
      const newNotification = await res.json();
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const markNotificationRead = async (id: string) => {
    const res = await fetch(`http://localhost:3001/api/notifications/${id}/read`, {
      method: 'PUT', headers: getAuthHeaders()
    });
    if (res.ok) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const value = useMemo(() => ({
    projects,
    tasks,
    users,
    notifications,
    loading,
    currentProject,
    setCurrentProject,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addNotification,
    markNotificationRead
  }), [projects, tasks, users, notifications, loading, currentProject]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};