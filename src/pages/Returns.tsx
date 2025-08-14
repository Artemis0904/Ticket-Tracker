import { useNavigate } from 'react-router-dom';
import EngineerLayout from '@/components/EngineerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { returnItems } from '@/data/engineerData';
import { ArrowLeft, Package, Clock, Truck, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const Returns = () => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const colors = {
      'pending-pickup': 'bg-yellow-100 text-yellow-800',
      'in-transit': 'bg-blue-100 text-blue-800',
      'received': 'bg-green-100 text-green-800',
      'processing': 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const getConditionBadge = (condition: string) => {
    const colors = {
      'Working': 'bg-green-100 text-green-800',
      'Non-Working': 'bg-red-100 text-red-800',
      'New': 'bg-blue-100 text-blue-800',
      'Refurbished': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {condition}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending-pickup':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in-transit':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'received':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Package className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <EngineerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/engineer-dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Equipment Returns</h1>
            <p className="text-muted-foreground">Track the status of equipment being returned to the store</p>
          </div>
        </div>

        {/* Returns Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Return Items Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return ID</TableHead>
                  <TableHead>Equipment Name</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Estimated Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.equipmentName}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.serialNumber}</TableCell>
                    <TableCell>{format(new Date(item.returnDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                    </TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell>{getConditionBadge(item.condition)}</TableCell>
                    <TableCell>${item.estimatedValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Pickup</p>
                  <p className="text-2xl font-bold">
                    {returnItems.filter(item => item.status === 'pending-pickup').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold">
                    {returnItems.filter(item => item.status === 'in-transit').length}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Received</p>
                  <p className="text-2xl font-bold">
                    {returnItems.filter(item => item.status === 'received').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">
                    ${returnItems.reduce((sum, item) => sum + item.estimatedValue, 0)}
                  </p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EngineerLayout>
  );
};

export default Returns;