
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  trendLabel,
  className,
  valueClassName,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden animate-scale-in", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold animate-fade-in">
          <span className={valueClassName}>{value}</span>
        </div>
        {(description || trend !== undefined) && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
            {trend !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 ml-2",
                  trend > 0 ? "text-income" : trend < 0 ? "text-expense" : ""
                )}
              >
                {trend > 0 ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : trend < 0 ? (
                  <ArrowDownIcon className="h-3 w-3" />
                ) : null}
                {Math.abs(trend)}% {trendLabel}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
