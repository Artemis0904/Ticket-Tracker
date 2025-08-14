export const engineerTickets = [
  {
    id: 'TKT-001',
    title: 'Network Cable Replacement',
    description: 'Need 50m Cat6 cables for server room upgrade',
    status: 'approved',
    urgency: 'medium',
    raisedBy: 'Engineer',
    dateRaised: '2024-01-15',
    zone: 'Zone A',
    materialType: 'Cables',
    quantity: 50,
    estimatedCost: 250
  },
  {
    id: 'TKT-002',
    title: 'Server Maintenance Tools',
    description: 'Screwdriver set and thermal paste for server maintenance',
    status: 'pending',
    urgency: 'low',
    raisedBy: 'Engineer',
    dateRaised: '2024-01-18',
    zone: 'Zone B',
    materialType: 'Tools',
    quantity: 1,
    estimatedCost: 85
  },
  {
    id: 'TKT-003',
    title: 'Router Configuration Equipment',
    description: 'Console cables and USB adapters for router setup',
    status: 'in-transit',
    urgency: 'high',
    raisedBy: 'Engineer',
    dateRaised: '2024-01-20',
    zone: 'Zone A',
    materialType: 'Equipment',
    quantity: 5,
    estimatedCost: 120
  },
  {
    id: 'TKT-004',
    title: 'Safety Equipment',
    description: 'Anti-static wrist straps and safety glasses',
    status: 'delivered',
    urgency: 'medium',
    raisedBy: 'Engineer',
    dateRaised: '2024-01-12',
    zone: 'Zone C',
    materialType: 'Safety',
    quantity: 10,
    estimatedCost: 75
  }
];

export const engineerShipments = [
  {
    id: 'SHP-101',
    ticketId: 'TKT-001',
    material: 'Cat6 Network Cables',
    quantity: 50,
    status: 'in-transit',
    shippedDate: '2024-01-16',
    expectedDelivery: '2024-01-22',
    trackingNumber: 'TRK789456123'
  },
  {
    id: 'SHP-102',
    ticketId: 'TKT-003',
    material: 'Console Cables & USB Adapters',
    quantity: 5,
    status: 'shipped',
    shippedDate: '2024-01-21',
    expectedDelivery: '2024-01-25',
    trackingNumber: 'TRK789456124'
  },
  {
    id: 'SHP-103',
    ticketId: 'TKT-004',
    material: 'Safety Equipment Set',
    quantity: 10,
    status: 'delivered',
    shippedDate: '2024-01-13',
    expectedDelivery: '2024-01-18',
    trackingNumber: 'TRK789456125'
  }
];

export const returnItems = [
  {
    id: 'RET-001',
    equipmentName: 'Old Network Switch',
    serialNumber: 'NS-2401-001',
    returnDate: '2024-01-20',
    status: 'pending-pickup',
    reason: 'Equipment Upgrade',
    condition: 'Working',
    estimatedValue: 450
  },
  {
    id: 'RET-002',
    equipmentName: 'Faulty Router',
    serialNumber: 'RT-2401-002',
    returnDate: '2024-01-18',
    status: 'in-transit',
    reason: 'Defective',
    condition: 'Non-Working',
    estimatedValue: 0
  },
  {
    id: 'RET-003',
    equipmentName: 'Surplus Cables',
    serialNumber: 'CBL-2401-003',
    returnDate: '2024-01-15',
    status: 'received',
    reason: 'Project Completion',
    condition: 'New',
    estimatedValue: 120
  },
  {
    id: 'RET-004',
    equipmentName: 'Test Equipment',
    serialNumber: 'TST-2401-004',
    returnDate: '2024-01-22',
    status: 'pending-pickup',
    reason: 'Rental Return',
    condition: 'Working',
    estimatedValue: 800
  }
];

export const engineerWorkReports = [
  {
    id: 'WR-001',
    taskName: 'Network Infrastructure Setup',
    date: '2024-01-15',
    hoursWorked: 8,
    status: 'completed',
    ticketId: 'TKT-001',
    description: 'Installed and configured network cables in Zone A'
  },
  {
    id: 'WR-002',
    taskName: 'Server Maintenance',
    date: '2024-01-18',
    hoursWorked: 6,
    status: 'in-progress',
    ticketId: 'TKT-002',
    description: 'Routine maintenance of server equipment'
  },
  {
    id: 'WR-003',
    taskName: 'Router Configuration',
    date: '2024-01-20',
    hoursWorked: 4,
    status: 'completed',
    ticketId: 'TKT-003',
    description: 'Configured new router settings for Zone B'
  },
  {
    id: 'WR-004',
    taskName: 'Safety Inspection',
    date: '2024-01-12',
    hoursWorked: 3,
    status: 'completed',
    ticketId: 'TKT-004',
    description: 'Conducted safety equipment inspection'
  }
];