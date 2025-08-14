import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TicketStatusBadge from '@/components/TicketStatusBadge';
import TicketPriorityBadge from '@/components/TicketPriorityBadge';
import { SearchIcon, FilterIcon, PlusIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Ticket, TicketStatus, TicketPriority } from '@/types/ticket';

const TicketList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isRM, setIsRM] = useState(false);
  const { toast } = useToast();

  const { data: rows, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (rows) {
      const mapped = (rows as any[]).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description ?? '',
        status: row.status,
        priority: row.priority,
        requester: { id: row.user_id, name: 'Requester', email: '', role: 'customer' as const },
        assignee: undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        dueDate: row.due_date ? new Date(row.due_date) : undefined,
        tags: row.tags ?? [],
        comments: [],
        attachments: row.attachments ?? [],
      }) as Ticket);
      setTickets(mapped);
    }
  }, [rows]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('department')
          .eq('id', user.id)
          .maybeSingle();
        setIsRM(profile?.department === 'regional_manager');
      }
    });
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.requester.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">
            Manage and track all support tickets
          </p>
        </div>
        <Link to="/tickets/new">
          <Button className="gap-2">
            <PlusIcon className="h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as TicketPriority | 'all')}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ticket List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">No tickets found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <Link 
                          to={`/tickets/${ticket.id}`}
                          className="text-lg font-semibold hover:text-primary transition-colors"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{ticket.id}</span>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={ticket.requester.avatar} />
                          <AvatarFallback className="text-xs">
                            {ticket.requester.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{ticket.requester.name}</span>
                      </div>
                      <span>•</span>
                      <span>Created {formatDate(ticket.createdAt)}</span>
                      {ticket.assignee && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-2">
                            <span>Assigned to</span>
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={ticket.assignee.avatar} />
                              <AvatarFallback className="text-xs">
                                {ticket.assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{ticket.assignee.name}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TicketPriorityBadge priority={ticket.priority} />
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;