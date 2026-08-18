import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CalendarEvent } from "../schemas/event.schema";
import { toast } from "sonner";

// Mock data
let mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Sync",
    description: "Weekly sync meeting",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    type: "meeting",
  },
  {
    id: "2",
    title: "Client Call",
    description: "Discuss project requirements",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    type: "event",
  },
  {
    id: "3",
    title: "Prepare Report",
    description: "Prepare monthly sales report",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: "task",
    allDay: true,
  }
];

// In a real application, these would be API calls
const fetchEvents = async (): Promise<CalendarEvent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockEvents]), 500);
  });
};

const createEvent = async (event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
      mockEvents.push(newEvent);
      resolve(newEvent);
    }, 300);
  });
};

const updateEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockEvents = mockEvents.map((e) => (e.id === event.id ? event : e));
      resolve(event);
    }, 300);
  });
};

const deleteEvent = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockEvents = mockEvents.filter((e) => e.id !== id);
      resolve();
    }, 300);
  });
};

export const useEvents = () => {
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created successfully");
    },
    onError: () => {
      toast.error("Failed to create event");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event updated successfully");
    },
    onError: () => {
      toast.error("Failed to update event");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete event");
    },
  });

  return {
    events: eventsQuery.data || [],
    isLoading: eventsQuery.isLoading,
    isError: eventsQuery.isError,
    createEvent: createMutation.mutateAsync,
    updateEvent: updateMutation.mutateAsync,
    deleteEvent: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
