import type { CalendarEvent } from "../schemas/event.schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface UpcomingTasksProps {
  events: CalendarEvent[];
}

export function UpcomingTasks({ events }: UpcomingTasksProps) {
  const upcomingEvents = events
    .filter((e) => e.start > new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5);

  if (upcomingEvents.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm border rounded-lg bg-card">
        No upcoming events or tasks.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upcomingEvents.map((event) => (
        <div
          key={event.id}
          className="p-3 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-sm truncate pr-2">{event.title}</h4>
            <Badge
              variant="outline"
              className={
                event.type === "meeting"
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                  : event.type === "event"
                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
              }
            >
              {event.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {format(event.start, "MMM d, yyyy h:mm a")}
          </p>
          {event.description && (
            <p className="text-xs text-muted-foreground truncate mt-1">
              {event.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
