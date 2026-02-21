import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  interpretation: string;
  status?: 'good' | 'warning' | 'concern' | 'neutral';
  icon?: React.ReactNode;
}

export default function MetricDisplay({
  label,
  value,
  interpretation,
  status = 'neutral',
  icon
}: MetricDisplayProps) {
  const statusConfig = {
    good: {
      badge: 'Good',
      color: 'bg-success/10 text-success border-success/20',
      icon: <TrendingUp className="w-4 h-4" />
    },
    warning: {
      badge: 'Monitor',
      color: 'bg-warning/10 text-warning border-warning/20',
      icon: <Minus className="w-4 h-4" />
    },
    concern: {
      badge: 'Concern',
      color: 'bg-destructive/10 text-destructive border-destructive/20',
      icon: <TrendingDown className="w-4 h-4" />
    },
    neutral: {
      badge: 'Info',
      color: 'bg-muted text-muted-foreground border-border',
      icon: <Minus className="w-4 h-4" />
    }
  };

  const config = statusConfig[status];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon && <div className="text-primary">{icon}</div>}
            <h3 className="font-semibold text-sm">{label}</h3>
          </div>
          <Badge variant="outline" className={config.color}>
            {config.icon}
            <span className="ml-1">{config.badge}</span>
          </Badge>
        </div>
        <div className="text-2xl font-bold mb-2">{value}</div>
        <p className="text-xs text-muted-foreground">{interpretation}</p>
      </CardContent>
    </Card>
  );
}
