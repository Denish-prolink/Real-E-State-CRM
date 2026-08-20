import { useState } from "react";
import { Plus, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvents } from "../../calendar/hooks/useEvents";
import EventFormDrawer from "../../calendar/components/EventFormDrawer";
import type { CalendarEvent } from "../../calendar/schemas/event.schema";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function TasksPage() {
  const { events, createEvent, updateEvent, isLoading, deleteEvent } = useEvents();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const tasks = events.filter((e) => e.type === "task");

  const handleSelectEvent = (task: CalendarEvent) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleSubmit = async (values: Omit<CalendarEvent, "id">) => {
    if (selectedEvent && selectedEvent.id) {
      await updateEvent({ ...values, id: selectedEvent.id } as CalendarEvent);
    } else {
      await createEvent({ ...values, type: "task" }); // Force type to task if creating from this page
    }
    setDrawerOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedEvent(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all your tasks. They also appear on your calendar.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedEvent({
              id: "",
              title: "",
              start: new Date(),
              end: new Date(new Date().setHours(new Date().getHours() + 1)),
              type: "task",
            });
            setDrawerOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 cursor-pointer group"
            onClick={() => handleSelectEvent(task)}
          >
            <div className="flex justify-between items-start">
              <h4 className="font-semibold text-md truncate pr-2 group-hover:text-indigo-600 transition-colors">
                {task.title}
              </h4>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 shrink-0">
                Task
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
               <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                 <CheckCircle2 className="w-3 h-3" /> Due {format(task.start, "MMM d, yyyy")}
               </span>
               <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  if(confirm("Are you sure you want to delete this task?")) {
                    deleteEvent(task.id);
                  }
                }}
               >
                 <Trash2 className="h-4 w-4" />
               </Button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-card/50">
            <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm mt-1">Click "Add Task" to create one.</p>
          </div>
        )}
      </div>

      <EventFormDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
        eventToEdit={selectedEvent && selectedEvent.id ? selectedEvent : null}
      />
    </div>
  );
}
