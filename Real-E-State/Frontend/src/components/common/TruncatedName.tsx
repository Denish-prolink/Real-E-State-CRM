import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TruncatedNameProps {
  name: string;
  maxLength?: number;
  className?: string;
}

export function TruncatedName({ name, maxLength = 18, className = "" }: TruncatedNameProps) {
  if (!name) return null;
  
  if (name.length <= maxLength) {
    return <span className={className}>{name}</span>;
  }
  
  const truncated = name.slice(0, maxLength) + '...';
  
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className={` transition-colors duration-150 ${className}`}>
            {truncated}
          </span>
        }
      />
      <TooltipContent className="max-w-xs wrap-break-word">
        {name}
      </TooltipContent>
    </Tooltip>
  );
}
