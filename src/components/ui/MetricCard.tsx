import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  variant?: 1 | 2 | 3 | 4;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  variant = 1,
}: MetricCardProps) {
  const gradientClass = `gradient-metric-${variant}`;

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border card-hover animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                'text-sm font-medium',
                changeType === 'positive' && 'text-status-available',
                changeType === 'negative' && 'text-status-cancelled',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', gradientClass)}>
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}
