import { Ticket, User, Comment } from '@/types/ticket';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'agent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@customer.com',
    role: 'customer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'agent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@customer.com',
    role: 'customer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david'
  }
];

const mockComments: Comment[] = [
  {
    id: '1',
    content: 'I\'ve reproduced the issue and I\'m investigating the root cause.',
    author: mockUsers[1],
    createdAt: new Date('2024-01-15T10:30:00Z'),
    isInternal: false
  },
  {
    id: '2',
    content: 'Internal note: This seems related to the recent deployment.',
    author: mockUsers[1],
    createdAt: new Date('2024-01-15T11:00:00Z'),
    isInternal: true
  }
];

export const mockTickets: Ticket[] = [
  {
    id: 'TK-001',
    title: 'Unable to login to dashboard',
    description: 'Users are experiencing login issues when trying to access the main dashboard. The error message shows "Invalid credentials" even with correct login information.',
    status: 'open',
    priority: 'high',
    assignee: mockUsers[1],
    requester: mockUsers[2],
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T11:30:00Z'),
    dueDate: new Date('2024-01-18T17:00:00Z'),
    tags: ['authentication', 'dashboard', 'urgent'],
    comments: [mockComments[0], mockComments[1]],
    attachments: ['error-screenshot.png']
  },
  {
    id: 'TK-002',
    title: 'Slow page loading times',
    description: 'The application is loading very slowly, especially on the reports page. Page load times are taking over 30 seconds.',
    status: 'in-progress',
    priority: 'medium',
    assignee: mockUsers[3],
    requester: mockUsers[4],
    createdAt: new Date('2024-01-14T14:30:00Z'),
    updatedAt: new Date('2024-01-15T16:45:00Z'),
    dueDate: new Date('2024-01-20T17:00:00Z'),
    tags: ['performance', 'reports'],
    comments: [],
    attachments: []
  },
  {
    id: 'TK-003',
    title: 'Feature request: Dark mode',
    description: 'Many users have requested a dark mode option for the application to reduce eye strain during extended use.',
    status: 'open',
    priority: 'low',
    assignee: undefined,
    requester: mockUsers[2],
    createdAt: new Date('2024-01-13T11:15:00Z'),
    updatedAt: new Date('2024-01-13T11:15:00Z'),
    dueDate: undefined,
    tags: ['feature-request', 'ui'],
    comments: [],
    attachments: []
  },
  {
    id: 'TK-004',
    title: 'Data export functionality broken',
    description: 'The CSV export feature is not working. When users click the export button, nothing happens and no file is downloaded.',
    status: 'resolved',
    priority: 'medium',
    assignee: mockUsers[1],
    requester: mockUsers[4],
    createdAt: new Date('2024-01-12T08:20:00Z'),
    updatedAt: new Date('2024-01-14T13:30:00Z'),
    dueDate: new Date('2024-01-16T17:00:00Z'),
    tags: ['export', 'data'],
    comments: [],
    attachments: ['export-test.csv']
  },
  {
    id: 'TK-005',
    title: 'Security vulnerability in user upload',
    description: 'A potential security vulnerability has been identified in the file upload functionality that could allow malicious file uploads.',
    status: 'closed',
    priority: 'critical',
    assignee: mockUsers[0],
    requester: mockUsers[1],
    createdAt: new Date('2024-01-10T16:45:00Z'),
    updatedAt: new Date('2024-01-12T10:20:00Z'),
    dueDate: new Date('2024-01-11T17:00:00Z'),
    tags: ['security', 'upload', 'critical'],
    comments: [],
    attachments: ['security-report.pdf']
  }
];

export const getTicketStats = () => {
  const total = mockTickets.length;
  const open = mockTickets.filter(t => t.status === 'open').length;
  const inProgress = mockTickets.filter(t => t.status === 'in-progress').length;
  const resolved = mockTickets.filter(t => t.status === 'resolved').length;
  const closed = mockTickets.filter(t => t.status === 'closed').length;
  
  return { total, open, inProgress, resolved, closed };
};