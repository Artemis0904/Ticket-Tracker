import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeftIcon, TruckIcon, PackageIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMaterialRequests } from '@/hooks/useMaterialRequests';
import { format } from 'date-fns';

const ShipmentStatus = () => {
  const navigate = useNavigate();
  const { requests, isLoading } = useMaterialRequests();

  // Filter for requests that are in-transit or delivered
  const shipments = requests.filter(r => r.status === 'in-transit' || r.status === 'delivered');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return PackageIcon;
      case 'in-transit': return TruckIcon;
      case 'delivered': return PackageIcon;
      case 'rejected': return PackageIcon;
      default: return PackageIcon;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/store-manager/dashboard')}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipment Status</h1>
          <p className="text-muted-foreground">
            Track all materials that have been shipped and their current status.
          </p>
        </div>
      </div>

      {/* Shipment Status Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="h-5 w-5" />
            All Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading shipments...</div>
          ) : shipments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No shipments found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Created</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Transport Mode</TableHead>
                  <TableHead>Tracking Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => {
                  const StatusIcon = getStatusIcon(shipment.status);
                  return (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.id.slice(-8)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PackageIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{shipment.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>{shipment.requestedBy}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{shipment.zone || '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(shipment.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {shipment.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{format(new Date(shipment.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {shipment.sentAt ? format(new Date(shipment.sentAt), 'MMM dd, yyyy') : '—'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{shipment.transportMode || '—'}</TableCell>
                      <TableCell className="font-mono text-sm">{shipment.trackingNo || '—'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentStatus;