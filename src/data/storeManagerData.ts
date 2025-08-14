import { User } from '@/types/ticket';

export interface MaterialRequest {
  id: string;
  title: string;
  summary: string;
  raisedBy: User;
  dateRaised: Date;
  status: 'pending' | 'approved' | 'in-transit' | 'delivered' | 'rejected';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  materialType: string;
  quantity: number;
  estimatedCost: number;
}

export interface ShipmentStatus {
  id: string;
  materialName: string;
  quantity: number;
  destination: string;
  status: 'preparing' | 'shipped' | 'in-transit' | 'delivered' | 'delayed';
  shippedDate: Date;
  expectedDelivery: Date;
  trackingNumber: string;
}

export interface TicketLog {
  id: string;
  ticketId: string;
  ticketTitle: string;
  note: string;
  author: User;
  timestamp: Date;
  type: 'comment' | 'status_change' | 'assignment' | 'priority_change';
}

export interface ReportData {
  month: string;
  materialRequests: number;
  approved: number;
  rejected: number;
  delivered: number;
  totalCost: number;
}

// Mock Users
export const storeUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@store.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@store.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@store.com',
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'Lisa Brown',
    email: 'lisa@store.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
  }
];

// Mock Material Requests
export const mockMaterialRequests: MaterialRequest[] = [
  {
    id: 'MR-001',
    title: 'Office Supplies Restock',
    summary: 'Need to restock printer paper, pens, and folders for Q4',
    raisedBy: storeUsers[0],
    dateRaised: new Date('2024-01-15'),
    status: 'approved',
    urgency: 'medium',
    materialType: 'Office Supplies',
    quantity: 50,
    estimatedCost: 250.00
  },
  {
    id: 'MR-002',
    title: 'Safety Equipment Order',
    summary: 'Urgent order for safety helmets and protective gear',
    raisedBy: storeUsers[1],
    dateRaised: new Date('2024-01-18'),
    status: 'in-transit',
    urgency: 'high',
    materialType: 'Safety Equipment',
    quantity: 25,
    estimatedCost: 750.00
  },
  {
    id: 'MR-003',
    title: 'Computer Hardware Upgrade',
    summary: 'Request for new laptops and monitors for the team',
    raisedBy: storeUsers[2],
    dateRaised: new Date('2024-01-20'),
    status: 'pending',
    urgency: 'low',
    materialType: 'Electronics',
    quantity: 10,
    estimatedCost: 5000.00
  },
  {
    id: 'MR-004',
    title: 'Cleaning Supplies Emergency',
    summary: 'Immediate need for sanitizers and cleaning materials',
    raisedBy: storeUsers[3],
    dateRaised: new Date('2024-01-22'),
    status: 'delivered',
    urgency: 'critical',
    materialType: 'Cleaning Supplies',
    quantity: 100,
    estimatedCost: 400.00
  },
  {
    id: 'MR-005',
    title: 'Warehouse Storage Equipment',
    summary: 'Additional shelving units and storage containers needed',
    raisedBy: storeUsers[0],
    dateRaised: new Date('2024-01-25'),
    status: 'rejected',
    urgency: 'medium',
    materialType: 'Storage Equipment',
    quantity: 20,
    estimatedCost: 1200.00
  }
];

// Mock Shipment Status
export const mockShipments: ShipmentStatus[] = [
  {
    id: 'SH-001',
    materialName: 'Office Supplies Package',
    quantity: 50,
    destination: 'Main Store - Downtown',
    status: 'delivered',
    shippedDate: new Date('2024-01-16'),
    expectedDelivery: new Date('2024-01-18'),
    trackingNumber: 'TR1234567890'
  },
  {
    id: 'SH-002',
    materialName: 'Safety Equipment Set',
    quantity: 25,
    destination: 'Warehouse - North',
    status: 'in-transit',
    shippedDate: new Date('2024-01-19'),
    expectedDelivery: new Date('2024-01-24'),
    trackingNumber: 'TR1234567891'
  },
  {
    id: 'SH-003',
    materialName: 'Cleaning Supplies Bulk',
    quantity: 100,
    destination: 'Store Branch - East',
    status: 'delivered',
    shippedDate: new Date('2024-01-23'),
    expectedDelivery: new Date('2024-01-25'),
    trackingNumber: 'TR1234567892'
  },
  {
    id: 'SH-004',
    materialName: 'Laptop Computers',
    quantity: 5,
    destination: 'Main Office',
    status: 'preparing',
    shippedDate: new Date('2024-01-26'),
    expectedDelivery: new Date('2024-01-30'),
    trackingNumber: 'TR1234567893'
  },
  {
    id: 'SH-005',
    materialName: 'Monitor Displays',
    quantity: 5,
    destination: 'Main Office',
    status: 'delayed',
    shippedDate: new Date('2024-01-20'),
    expectedDelivery: new Date('2024-01-28'),
    trackingNumber: 'TR1234567894'
  }
];

// Mock Ticket Logs
export const mockTicketLogs: TicketLog[] = [
  {
    id: 'LOG-001',
    ticketId: 'MR-001',
    ticketTitle: 'Office Supplies Restock',
    note: 'Request approved by procurement team',
    author: storeUsers[2],
    timestamp: new Date('2024-01-16 09:30'),
    type: 'status_change'
  },
  {
    id: 'LOG-002',
    ticketId: 'MR-002',
    ticketTitle: 'Safety Equipment Order',
    note: 'Assigned to safety equipment vendor',
    author: storeUsers[2],
    timestamp: new Date('2024-01-19 14:15'),
    type: 'assignment'
  },
  {
    id: 'LOG-003',
    ticketId: 'MR-003',
    ticketTitle: 'Computer Hardware Upgrade',
    note: 'Waiting for budget approval from finance',
    author: storeUsers[1],
    timestamp: new Date('2024-01-21 11:00'),
    type: 'comment'
  },
  {
    id: 'LOG-004',
    ticketId: 'MR-004',
    ticketTitle: 'Cleaning Supplies Emergency',
    note: 'Priority changed to critical due to shortage',
    author: storeUsers[3],
    timestamp: new Date('2024-01-22 16:45'),
    type: 'priority_change'
  },
  {
    id: 'LOG-005',
    ticketId: 'MR-005',
    ticketTitle: 'Warehouse Storage Equipment',
    note: 'Request rejected - over budget for Q1',
    author: storeUsers[2],
    timestamp: new Date('2024-01-26 10:20'),
    type: 'status_change'
  }
];

// Mock Report Data
export const mockReportData: ReportData[] = [
  {
    month: 'Oct',
    materialRequests: 45,
    approved: 35,
    rejected: 10,
    delivered: 30,
    totalCost: 12500
  },
  {
    month: 'Nov',
    materialRequests: 52,
    approved: 42,
    rejected: 10,
    delivered: 38,
    totalCost: 15200
  },
  {
    month: 'Dec',
    materialRequests: 38,
    approved: 28,
    rejected: 10,
    delivered: 25,
    totalCost: 9800
  },
  {
    month: 'Jan',
    materialRequests: 48,
    approved: 38,
    rejected: 10,
    delivered: 32,
    totalCost: 14100
  }
];

export const getMaterialRequestStats = () => {
  const total = mockMaterialRequests.length;
  const pending = mockMaterialRequests.filter(r => r.status === 'pending').length;
  const approved = mockMaterialRequests.filter(r => r.status === 'approved').length;
  const inTransit = mockMaterialRequests.filter(r => r.status === 'in-transit').length;
  const delivered = mockMaterialRequests.filter(r => r.status === 'delivered').length;
  const rejected = mockMaterialRequests.filter(r => r.status === 'rejected').length;

  return { total, pending, approved, inTransit, delivered, rejected };
};