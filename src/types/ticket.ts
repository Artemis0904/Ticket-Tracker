export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'admin' | 'agent' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  isInternal: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee?: User;
  requester: User;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
  comments: Comment[];
  attachments: string[];
}