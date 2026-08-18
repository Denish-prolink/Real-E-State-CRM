import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarView } from "../components/CalendarView";
import EventFormDrawer from "../components/EventFormDrawer";
import { UpcomingTasks } from "../components/UpcomingTasks";
import { useEvents } from "../hooks/useEvents";
import type { CalendarEvent } from "../schemas/event.schema";
import { SectionTitle } from "@/components/common/FormHelpers";

export default function CalendarPage() {
  const { events, createEvent, updateEvent, isLoading } = useEvents();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedEvent({
      id: "",
      title: "",
      start: slotInfo.start,
      end: slotInfo.end,
      type: "event",
    });
    setDrawerOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: Omit<CalendarEvent, "id">) => {
    if (selectedEvent && selectedEvent.id) {
      await updateEvent({ ...values, id: selectedEvent.id } as CalendarEvent);
    } else {
      await createEvent(values);
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
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 flex flex-col xl:flex-row gap-6 p-6 overflow-hidden">
        
        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Calendar</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your tasks, events, and meetings.
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedEvent(null);
                setDrawerOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </Button>
          </div>
          
          <div className="flex-1 min-h-[600px]">
            <CalendarView 
              events={events} 
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
            />
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="w-full xl:w-80 flex flex-col shrink-0 space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <div className="mb-4"><SectionTitle>Upcoming</SectionTitle></div>
            <UpcomingTasks events={events} />
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <div className="mb-4"><SectionTitle>Overview</SectionTitle></div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  Tasks
                </span>
                <span className="font-medium">{events.filter(e => e.type === 'task').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Events
                </span>
                <span className="font-medium">{events.filter(e => e.type === 'event').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                  Meetings
                </span>
                <span className="font-medium">{events.filter(e => e.type === 'meeting').length}</span>
              </div>
            </div>
          </div>
        </div>

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
