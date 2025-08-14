import { User } from '@/types/ticket';

export interface ZoneMaterialRequest {
  id: string;
  title: string;
  zone: string;
  requestedBy: User;
  dateRequested: Date;
  status: 'pending' | 'approved' | 'in-process' | 'in-transit' | 'delivered' | 'rejected';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  materialType: string;
  quantity: number;
  estimatedCost: number;
  description: string;
}

export interface ShipmentProcessData {
  status: string;
  count: number;
  percentage: number;
}

// Mock Users for Regional Manager
export const regionalUsers: User[] = [
  {
    id: '1',
    name: 'Alice Cooper',
    email: 'alice@region.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b5?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@region.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Carol Smith',
    email: 'carol@region.com',
    role: 'agent',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@region.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=32&h=32&fit=crop&crop=face'
  }
];

// Mock Zone Material Requests
export const mockZoneMaterialRequests: ZoneMaterialRequest[] = [
  {
    id: 'ZMR-001',
    title: 'Industrial Equipment Request',
    zone: 'North Zone',
    requestedBy: regionalUsers[0],
    dateRequested: new Date('2024-01-15'),
    status: 'approved',
    urgency: 'high',
    materialType: 'Industrial Equipment',
    quantity: 15,
    estimatedCost: 12500.00,
    description: 'Heavy machinery for construction project'
  },
  {
    id: 'ZMR-002',
    title: 'Safety Gear Bulk Order',
    zone: 'South Zone',
    requestedBy: regionalUsers[1],
    dateRequested: new Date('2024-01-18'),
    status: 'in-transit',
    urgency: 'medium',
    materialType: 'Safety Equipment',
    quantity: 200,
    estimatedCost: 8500.00,
    description: 'Personal protective equipment for workforce'
  },
  {
    id: 'ZMR-003',
    title: 'Office Renovation Materials',
    zone: 'East Zone',
    requestedBy: regionalUsers[2],
    dateRequested: new Date('2024-01-20'),
    status: 'pending',
    urgency: 'low',
    materialType: 'Construction Materials',
    quantity: 50,
    estimatedCost: 15000.00,
    description: 'Materials for office space renovation'
  },
  {
    id: 'ZMR-004',
    title: 'IT Infrastructure Upgrade',
    zone: 'West Zone',
    requestedBy: regionalUsers[3],
    dateRequested: new Date('2024-01-22'),
    status: 'delivered',
    urgency: 'critical',
    materialType: 'Electronics',
    quantity: 30,
    estimatedCost: 25000.00,
    description: 'Servers and networking equipment'
  },
  {
    id: 'ZMR-005',
    title: 'Vehicle Maintenance Parts',
    zone: 'Central Zone',
    requestedBy: regionalUsers[0],
    dateRequested: new Date('2024-01-25'),
    status: 'in-process',
    urgency: 'medium',
    materialType: 'Automotive Parts',
    quantity: 75,
    estimatedCost: 5500.00,
    description: 'Spare parts for fleet maintenance'
  },
  {
    id: 'ZMR-006',
    title: 'Medical Supplies Emergency',
    zone: 'North Zone',
    requestedBy: regionalUsers[1],
    dateRequested: new Date('2024-01-28'),
    status: 'pending',
    urgency: 'critical',
    materialType: 'Medical Supplies',
    quantity: 100,
    estimatedCost: 3500.00,
    description: 'Emergency medical supplies for health center'
  }
];

// Mock Shipment Process Data
export const mockShipmentProcessData: ShipmentProcessData[] = [
  {
    status: 'In Process',
    count: 15,
    percentage: 25
  },
  {
    status: 'In Transit',
    count: 30,
    percentage: 50
  },
  {
    status: 'Delivered',
    count: 15,
    percentage: 25
  }
];

export const getRegionalStats = () => {
  const total = mockZoneMaterialRequests.length;
  const pending = mockZoneMaterialRequests.filter(r => r.status === 'pending').length;
  const approved = mockZoneMaterialRequests.filter(r => r.status === 'approved').length;
  const inProcess = mockZoneMaterialRequests.filter(r => r.status === 'in-process').length;
  const inTransit = mockZoneMaterialRequests.filter(r => r.status === 'in-transit').length;
  const delivered = mockZoneMaterialRequests.filter(r => r.status === 'delivered').length;
  const rejected = mockZoneMaterialRequests.filter(r => r.status === 'rejected').length;

  return { total, pending, approved, inProcess, inTransit, delivered, rejected };
};