import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
}

const StatsCard = ({ title, value, icon: Icon, description, trend }: StatsCardProps) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <span className="text-xs text-muted-foreground">
              {trend.value > 0 ? '+' : ''}{trend.value} {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;