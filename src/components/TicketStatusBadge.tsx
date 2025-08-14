import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '@/types/ticket';
import { cn } from '@/lib/utils';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusConfig = {
  open: {
    label: 'Open',
    className: 'bg-status-open/10 text-status-open border-status-open/20 hover:bg-status-open/20'
  },
  'in-progress': {
    label: 'In Progress', 
    className: 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20 hover:bg-status-in-progress/20'
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-status-resolved/10 text-status-resolved border-status-resolved/20 hover:bg-status-resolved/20'
  },
  closed: {
    label: 'Closed',
    className: 'bg-status-closed/10 text-status-closed border-status-closed/20 hover:bg-status-closed/20'
  }
};

const TicketStatusBadge = ({ status, className }: TicketStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
};

export default TicketStatusBadge;