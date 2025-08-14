import { Badge } from '@/components/ui/badge';
import { TicketPriority } from '@/types/ticket';
import { cn } from '@/lib/utils';

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

const priorityConfig = {
  low: {
    label: 'Low',
    className: 'bg-priority-low/10 text-priority-low border-priority-low/20 hover:bg-priority-low/20'
  },
  medium: {
    label: 'Medium',
    className: 'bg-priority-medium/10 text-priority-medium border-priority-medium/20 hover:bg-priority-medium/20'
  },
  high: {
    label: 'High',
    className: 'bg-priority-high/10 text-priority-high border-priority-high/20 hover:bg-priority-high/20'
  },
  critical: {
    label: 'Critical',
    className: 'bg-priority-critical/10 text-priority-critical border-priority-critical/20 hover:bg-priority-critical/20'
  }
};

const TicketPriorityBadge = ({ priority, className }: TicketPriorityBadgeProps) => {
  const config = priorityConfig[priority];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
};

export default TicketPriorityBadge;