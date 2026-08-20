import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "../../calendar/hooks/useEvents";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, CheckCircle2, Edit, Trash2 } from "lucide-react";
import EventFormDrawer from "../../calendar/components/EventFormDrawer";
import { useState } from "react";
import type { CalendarEvent } from "../../calendar/schemas/event.schema";

export default function ViewTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, isLoading, deleteEvent, updateEvent } = useEvents();
  
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-muted-foreground text-sm mt-4">Loading task details...</p>
      </div>
    );
  }

  const task = events.find(e => e.id === id);

  if (!task) {
    return (
      <div className="flex flex-col gap-6 p-6 min-h-full items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">Task Not Found</h2>
        <p className="text-slate-500">The task you are looking for does not exist or has been deleted.</p>
        <Button variant="outline" onClick={() => navigate("/tasks")}>Back to Tasks</Button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete this task?")) {
      await deleteEvent(task.id);
      navigate("/tasks");
    }
  };

  const handleUpdate = async (values: Omit<CalendarEvent, "id">) => {
    await updateEvent({ ...values, id: task.id } as CalendarEvent);
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-zinc-950/20 p-6 space-y-6">
      
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/tasks")}
            className="h-8 w-8 text-slate-500 hover:text-slate-900 bg-white/50 hover:bg-slate-200/50 shadow-sm border border-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Task Details
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)} className="gap-2 cursor-pointer">
            <Edit className="h-4 w-4" /> Edit Task
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-2 cursor-pointer">
            <Trash2 className="h-4 w-4" /> Delete Task
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Task Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <CheckCircle2 className="w-32 h-32" />
            </div>
            
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mb-4 inline-flex shadow-sm">
              {task.type.toUpperCase()}
            </Badge>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-zinc-100 mb-2">
              {task.title}
            </h2>
            
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-slate-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed text-base">
                {task.description || <span className="italic text-slate-400">No description provided for this task.</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Timeline/Schedule */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-zinc-800 pb-3 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Schedule
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Start Time</p>
                <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-200 font-medium">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p>{format(task.start, "PPP")}</p>
                    {!task.allDay && <p className="text-xs text-slate-500">{format(task.start, "p")}</p>}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">End Time</p>
                <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-200 font-medium">
                  <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p>{format(task.end, "PPP")}</p>
                    {!task.allDay && <p className="text-xs text-slate-500">{format(task.end, "p")}</p>}
                  </div>
                </div>
              </div>
              
              {task.allDay && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <Badge variant="secondary" className="w-full justify-center">All Day Event</Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EventFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleUpdate}
        eventToEdit={task}
      />
    </div>
  );
}
