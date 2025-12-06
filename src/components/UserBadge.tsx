import { useUserBadge } from '@/hooks/useUserBadge';
import { Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserBadgeProps {
  userId: string;
  showLabel?: boolean;
}

export const UserBadge = ({ userId, showLabel = false }: UserBadgeProps) => {
  const { badge, loading } = useUserBadge(userId);

  if (loading || badge.level === 'none') return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${badge.color} text-xs font-bold text-background shadow-lg`}>
            <Award className="w-3.5 h-3.5" />
            {showLabel && <span>{badge.label}</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{badge.label}</p>
          <p className="text-xs text-muted-foreground">{badge.engagements} engagements this month</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
