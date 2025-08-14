import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  PackageIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  TruckIcon,
  XCircleIcon,
  CalendarIcon
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { useAppStore } from '@/store/appStore';
import { useMaterialRequests } from '@/hooks/useMaterialRequests';
import { useState } from 'react';
import SMRequestViewer from '@/components/SMRequestViewer';
import { format } from 'date-fns';

const StoreManagerDashboard = () => {
  const { state } = useAppStore();
  const { requests, isLoading } = useMaterialRequests();
  const approved = requests.filter(r => r.status === 'approved');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const selectedRequest = selectedId ? requests.find(r => r.id === selectedId) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-transit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Material Request Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage all material requests and their statuses.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Approved"
          value={approved.length}
          icon={PackageIcon}
          description="All approved requests"
        />
        <StatsCard
          title="In Transit"
          value={requests.filter(r => r.status === 'in-transit').length}
          icon={TruckIcon}
          description="Being shipped"
        />
        <StatsCard
          title="Delivered"
          value={requests.filter(r => r.status === 'delivered').length}
          icon={CheckCircleIcon}
          description="Successfully delivered"
        />
        <StatsCard
          title="Rejected"
          value={requests.filter(r => r.status === 'rejected').length}
          icon={XCircleIcon}
          description="Rejected requests"
        />
      </div>

      {/* Material Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Approved Material Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading requests...</div>
            ) : approved.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No approved requests found</div>
            ) : approved.slice(0, 20).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => { setSelectedId(request.id); setEditorOpen(true); }}>
                <div className="space-y-2 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{request.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">By {request.requestedBy}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        approved
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">ID:</span>
                      <span>{request.id.slice(-8)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Items:</span>
                      <span>{request.items.reduce((s, i) => s + (i.quantity || 0), 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {selectedRequest && (
        <SMRequestViewer
          open={editorOpen}
          onOpenChange={(o) => { setEditorOpen(o); if (!o) setSelectedId(null); }}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default StoreManagerDashboard;