import { Project, Task, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'member',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'member',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design and improved UX',
    color: '#3B82F6',
    status: 'active',
    progress: 65,
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-03-15T00:00:00Z',
    budget: 50000,
    spentBudget: 32500,
    members: mockUsers,
    createdBy: '1',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'proj-2',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application for iOS and Android',
    color: '#10B981',
    status: 'active',
    progress: 40,
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-06-01T00:00:00Z',
    budget: 80000,
    spentBudget: 25000,
    members: [mockUsers[0], mockUsers[2]],
    createdBy: '1',
    createdAt: '2024-01-25T00:00:00Z'
  },
  {
    id: 'proj-3',
    name: 'Marketing Campaign',
    description: 'Q2 digital marketing campaign across all platforms',
    color: '#F59E0B',
    status: 'on-hold',
    progress: 25,
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2024-06-30T00:00:00Z',
    budget: 30000,
    spentBudget: 5000,
    members: [mockUsers[1]],
    createdBy: '1',
    createdAt: '2024-03-01T00:00:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design Homepage Layout',
    description: 'Create wireframes and mockups for the new homepage design',
    status: 'completed',
    priority: 'high',
    assignee: mockUsers[1],
    reporter: mockUsers[0],
    projectId: 'proj-1',
    dueDate: '2024-02-01T00:00:00Z',
    tags: ['design', 'ui/ux'],
    attachments: [],
    comments: [],
    timeEstimate: 16,
    timeSpent: 14,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Implement Navigation Menu',
    description: 'Build responsive navigation component with dropdown menus',
    status: 'in-progress',
    priority: 'medium',
    assignee: mockUsers[2],
    reporter: mockUsers[0],
    projectId: 'proj-1',
    dueDate: '2024-02-10T00:00:00Z',
    tags: ['development', 'frontend'],
    attachments: [],
    comments: [],
    timeEstimate: 12,
    timeSpent: 8,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z'
  },
  {
    id: 'task-3',
    title: 'Setup Development Environment',
    description: 'Configure development tools and deployment pipeline',
    status: 'todo',
    priority: 'urgent',
    assignee: mockUsers[2],
    reporter: mockUsers[0],
    projectId: 'proj-2',
    dueDate: '2024-02-15T00:00:00Z',
    tags: ['setup', 'devops'],
    attachments: [],
    comments: [],
    timeEstimate: 8,
    timeSpent: 0,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'task-4',
    title: 'Create User Authentication',
    description: 'Implement secure login and registration system',
    status: 'review',
    priority: 'high',
    assignee: mockUsers[0],
    reporter: mockUsers[0],
    projectId: 'proj-2',
    dueDate: '2024-02-20T00:00:00Z',
    tags: ['development', 'security'],
    attachments: [],
    comments: [],
    timeEstimate: 20,
    timeSpent: 18,
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-12T00:00:00Z'
  }
];