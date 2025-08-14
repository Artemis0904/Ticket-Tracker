import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeftIcon, ScrollTextIcon, MessageSquareIcon, SettingsIcon, UserIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { mockTicketLogs } from '@/data/storeManagerData';
import { format } from 'date-fns';

const TicketLogs = () => {
  const navigate = useNavigate();

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'comment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'status_change': return 'bg-green-100 text-green-800 border-green-200';
      case 'assignment': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'priority_change': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case 'comment': return MessageSquareIcon;
      case 'status_change': return SettingsIcon;
      case 'assignment': return UserIcon;
      case 'priority_change': return AlertTriangleIcon;
      default: return MessageSquareIcon;
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
          <h1 className="text-3xl font-bold tracking-tight">Ticket Logs</h1>
          <p className="text-muted-foreground">
            View all notes and activities associated with material request tickets.
          </p>
        </div>
      </div>

      {/* Ticket Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollTextIcon className="h-5 w-5" />
            All Ticket Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Ticket</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Author</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTicketLogs.map((log) => {
                const LogIcon = getLogTypeIcon(log.type);
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {format(log.timestamp, 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.ticketId}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {log.ticketTitle}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getLogTypeColor(log.type)}>
                        <LogIcon className="h-3 w-3 mr-1" />
                        {log.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-sm">{log.note}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={log.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {log.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{log.author.name}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketLogs;