import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import EngineerLayout from '@/components/EngineerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, FileText, Clock, CheckCircle, Truck, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useAppStore } from '@/store/appStore';
import { useMaterialRequests } from '@/hooks/useMaterialRequests';
import MRFormDialog from '@/components/MRFormDialog';
import MRCFormDialog from '@/components/MRCFormDialog';
import EngineerShipmentViewer from '@/components/EngineerShipmentViewer';

const EngineerDashboard = () => {
  const navigate = useNavigate();
  const { state } = useAppStore();
  const { requests, isLoading } = useMaterialRequests();
  const username = (state.currentUser || localStorage.getItem('currentUser') || 'Engineer') as string;
  const [shipOpen, setShipOpen] = useState(false);
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);

  const myRequests = requests.filter(
    (r) => (r.requestedBy || '').toLowerCase() === username.toLowerCase()
  );
  const myShipments = myRequests.filter((r) => r.status === 'in-transit' || r.status === 'delivered');

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      'in-transit': 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      'in-process': 'bg-indigo-100 text-indigo-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>{status.replace('-', ' ')}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in-transit':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'delivered':
        return <Package className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <EngineerLayout>
      <div className="space-y-6">
        {/* Header with MR Form Button */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-muted-foreground">Track your material requests and shipments</p>
            </div>
            <div className="flex gap-2">
              <MRFormDialog
                trigger={
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" /> MR Form
                  </Button>
                }
              />
              <MRCFormDialog
                trigger={
                  <Button variant="secondary" className="gap-2">
                    <Plus className="h-4 w-4" /> MRC Form
                  </Button>
                }
              />
            </div>
          </div>

        {/* My Tickets Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Material Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Raised</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRequests.map((ticket) => (
                  <TableRow 
                    key={ticket.id} 
                    className={`${ticket.status === 'in-transit' ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                    onClick={() => {
                      if (ticket.status === 'in-transit') {
                        setSelectedShipId(ticket.id);
                        setShipOpen(true);
                      }
                    }}
                  >
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {ticket.title}
                          {ticket.status === 'in-transit' && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              Click to mark received
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{ticket.items[0]?.description || '—'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{ticket.items.reduce((sum, i) => sum + (i.quantity || 0), 0)} items</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        {getStatusBadge(ticket.status)}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Shipment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              My Shipment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shipped Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Tracking Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myShipments.map((shipment) => (
                  <TableRow key={shipment.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelectedShipId(shipment.id); setShipOpen(true); }}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>{shipment.id}</TableCell>
                    <TableCell>{shipment.items[0]?.description || '—'}</TableCell>
                    <TableCell>{shipment.items.reduce((sum, i) => sum + (i.quantity || 0), 0)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(shipment.status)}
                        {getStatusBadge(shipment.status)}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(shipment.createdAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell className="font-mono text-sm">—</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {selectedShipId && (
          <EngineerShipmentViewer
            open={shipOpen}
            onOpenChange={(o) => { setShipOpen(o); if (!o) setSelectedShipId(null); }}
            request={requests.find(r => r.id === selectedShipId)!}
          />
        )}
      </div>
    </EngineerLayout>
  );
};

export default EngineerDashboard;
