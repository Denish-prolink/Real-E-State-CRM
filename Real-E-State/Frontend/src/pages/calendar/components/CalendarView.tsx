import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { CalendarEvent } from '../schemas/event.schema';
import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from 'react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
}

export function CalendarView({ events, onSelectEvent, onSelectSlot }: CalendarViewProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>('month');

  useEffect(() => {
    setMounted(true);
  }, []);

  const onNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);
  const onView = useCallback((newView: View) => setView(newView), [setView]);

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3b82f6'; // blue
    if (event.type === 'meeting') {
      backgroundColor = '#f59e0b'; // amber
    } else if (event.type === 'task') {
      backgroundColor = '#10b981'; // emerald
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  if (!mounted) return null;

  return (
    <div className={`h-full w-full bg-card rounded-xl border border-border shadow-sm overflow-hidden p-4 ${theme === 'dark' ? 'rbc-dark' : ''}`}>
      {/* We add some custom css to make react-big-calendar look good with tailwind/dark mode */}
      <style>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-header {
          padding: 8px 0;
          font-weight: 600;
          border-bottom: 1px solid var(--border);
        }
        .rbc-today {
          background-color: var(--muted);
        }
        .rbc-event {
          padding: 2px 5px;
        }
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
          border-color: var(--border);
          border-radius: 8px;
        }
        .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid var(--border);
        }
        .rbc-month-row + .rbc-month-row {
          border-top: 1px solid var(--border);
        }
        .rbc-header + .rbc-header {
          border-left: 1px solid var(--border);
        }
        .rbc-time-header-content {
          border-left: 1px solid var(--border);
        }
        .rbc-time-content {
          border-top: 1px solid var(--border);
        }
        .rbc-timeslot-group {
          border-bottom: 1px solid var(--border);
        }
        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid var(--border);
          opacity: 0.5;
        }
        .rbc-button-link {
          color: inherit;
        }
        /* Toolbar */
        .rbc-toolbar button {
          color: var(--foreground);
          border-color: var(--border);
        }
        .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
          background-color: var(--muted);
          color: var(--foreground);
          border-color: var(--border);
          box-shadow: none;
        }
        .rbc-toolbar button:hover {
          background-color: var(--muted);
        }
      `}</style>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
        onSelectEvent={(event) => onSelectEvent(event as CalendarEvent)}
        onSelectSlot={onSelectSlot}
        selectable
        popup
        views={['month', 'week', 'day', 'agenda']}
        eventPropGetter={eventStyleGetter}
        date={date}
        onNavigate={onNavigate}
        view={view}
        onView={onView}
      />
    </div>
  );
}
