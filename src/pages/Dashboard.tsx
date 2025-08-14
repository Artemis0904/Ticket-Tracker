import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/StatsCard';
import TicketStatusBadge from '@/components/TicketStatusBadge';
import TicketPriorityBadge from '@/components/TicketPriorityBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TicketIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  TrendingUpIcon 
} from 'lucide-react';
import { mockTickets, getTicketStats } from '@/data/mockData';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = getTicketStats();
  const recentTickets = mockTickets.slice(0, 5);
  const urgentTickets = mockTickets.filter(t => t.priority === 'high' || t.priority === 'critical');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your tickets.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tickets"
          value={stats.total}
          icon={TicketIcon}
          description="All time tickets"
        />
        <StatsCard
          title="Open Tickets"
          value={stats.open}
          icon={ClockIcon}
          description="Awaiting response"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={TrendingUpIcon}
          description="Being worked on"
        />
        <StatsCard
          title="Resolved Today"
          value={stats.resolved}
          icon={CheckCircleIcon}
          description="Completed tickets"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Tickets */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <Link 
                      to={`/tickets/${ticket.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {ticket.title}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{ticket.id}</span>
                      <span>•</span>
                      <span>{ticket.requester.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TicketPriorityBadge priority={ticket.priority} />
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Urgent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircleIcon className="h-5 w-5 text-destructive" />
              Urgent Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgentTickets.map((ticket) => (
                <div key={ticket.id} className="space-y-2">
                  <Link 
                    to={`/tickets/${ticket.id}`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {ticket.title}
                  </Link>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {ticket.assignee && (
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={ticket.assignee.avatar} />
                          <AvatarFallback className="text-xs">
                            {ticket.assignee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {ticket.assignee?.name || 'Unassigned'}
                      </span>
                    </div>
                    <TicketPriorityBadge priority={ticket.priority} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;