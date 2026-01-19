import { cn } from '@/lib/utils';
import { BikeStatus, BookingStatus, PaymentStatus } from '@/types';

type StatusType = BikeStatus | BookingStatus | PaymentStatus;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  available: {
    label: 'Available',
    className: 'bg-status-available-bg text-status-available',
  },
  rented: {
    label: 'Rented',
    className: 'bg-status-rented-bg text-status-rented',
  },
  maintenance: {
    label: 'Maintenance',
    className: 'bg-status-maintenance-bg text-status-maintenance',
  },
  pending: {
    label: 'Pending',
    className: 'bg-status-pending-bg text-status-pending',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-status-rented-bg text-status-rented',
  },
  active: {
    label: 'Active',
    className: 'bg-status-available-bg text-status-available',
  },
  completed: {
    label: 'Completed',
    className: 'bg-secondary text-muted-foreground',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-status-cancelled-bg text-status-cancelled',
  },
  paid: {
    label: 'Paid',
    className: 'bg-status-available-bg text-status-available',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-status-maintenance-bg text-status-maintenance',
  },
  failed: {
    label: 'Failed',
    className: 'bg-status-cancelled-bg text-status-cancelled',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
