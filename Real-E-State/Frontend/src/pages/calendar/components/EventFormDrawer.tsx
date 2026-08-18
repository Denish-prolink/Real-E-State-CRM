import { FieldError, FormLabel } from "@/components/common/FormHelpers";
import { getInputClassName } from "@/components/common/formUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { eventSchema } from "../schemas/event.schema";
import type { EventFormValues, CalendarEvent } from "../schemas/event.schema";
import { useEffect } from "react";
import { useFormik } from "formik";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<CalendarEvent, "id">) => void | Promise<void>;
  eventToEdit?: CalendarEvent | null;
  isSubmitting?: boolean;
}

const getLocalDatetime = (date: Date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function EventFormDrawer({
  open,
  onClose,
  onSubmit,
  eventToEdit,
  isSubmitting = false,
}: Props) {
  const EMPTY_VALUES: EventFormValues = {
    title: "",
    description: "",
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    type: "task",
    allDay: false,
  };

  const formik = useFormik<EventFormValues>({
    initialValues: EMPTY_VALUES,
    validationSchema: eventSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, helpers) => {
      try {
        await onSubmit({
          title: values.title,
          description: values.description,
          start: new Date(values.start),
          end: new Date(values.end),
          type: values.type as any,
          allDay: values.allDay,
        });
        helpers.resetForm();
      } catch {
        // stay open on failure
      }
    },
  });

  useEffect(() => {
    if (open) {
      if (eventToEdit) {
        formik.resetForm({
          values: {
            title: eventToEdit.title,
            description: eventToEdit.description || "",
            start: eventToEdit.start,
            end: eventToEdit.end,
            type: eventToEdit.type,
            allDay: eventToEdit.allDay || false,
          },
        });
      } else {
        formik.resetForm({ values: { ...EMPTY_VALUES, start: new Date(), end: new Date(new Date().setHours(new Date().getHours() + 1)) } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, eventToEdit]);

  const inputCls = (field: string) =>
    getInputClassName(formik.errors, formik.touched, formik.submitCount, field);

  return (
    <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 shadow-sm">
          <SheetTitle className="text-lg font-semibold">
            {eventToEdit ? "Edit Task/Event" : "Add Task/Event"}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            {eventToEdit ? "Update details below." : "Create a new task, event, or meeting."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="flex-1 px-6 pt-6 flex flex-col gap-5 relative pb-6" noValidate>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FormLabel htmlFor="type" required>Type</FormLabel>
              <Select
                value={formik.values.type}
                onValueChange={(val) => formik.setFieldValue("type", val)}
              >
                <SelectTrigger className={cn("w-full h-9", inputCls("type"))}>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
              <FieldError error={formik.errors.type} touched={formik.touched.type} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="title" required>Title</FormLabel>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Weekly Team Sync"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls("title")}
              />
              <FieldError error={formik.errors.title} touched={formik.touched.title} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="description">Description</FormLabel>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Details about the task or event..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  inputCls("description")
                )}
              />
              <FieldError error={formik.errors.description} touched={formik.touched.description} submitCount={formik.submitCount} />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="allDay"
                name="allDay"
                checked={formik.values.allDay}
                onChange={formik.handleChange}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label htmlFor="allDay" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                All Day Event
              </label>
            </div>

            <div>
              <FormLabel htmlFor="start" required>Start Time</FormLabel>
              <Input
                id="start"
                name="start"
                type={formik.values.allDay ? "date" : "datetime-local"}
                value={formik.values.start ? (formik.values.allDay ? format(new Date(formik.values.start), "yyyy-MM-dd") : getLocalDatetime(new Date(formik.values.start))) : ""}
                onChange={(e) => formik.setFieldValue("start", new Date(e.target.value))}
                onBlur={formik.handleBlur}
                className={inputCls("start")}
              />
              <FieldError error={formik.errors.start as string} touched={formik.touched.start as unknown as boolean} submitCount={formik.submitCount} />
            </div>

            <div>
              <FormLabel htmlFor="end" required>End Time</FormLabel>
              <Input
                id="end"
                name="end"
                type={formik.values.allDay ? "date" : "datetime-local"}
                value={formik.values.end ? (formik.values.allDay ? format(new Date(formik.values.end), "yyyy-MM-dd") : getLocalDatetime(new Date(formik.values.end))) : ""}
                onChange={(e) => formik.setFieldValue("end", new Date(e.target.value))}
                onBlur={formik.handleBlur}
                className={inputCls("end")}
              />
              <FieldError error={formik.errors.end as string} touched={formik.touched.end as unknown as boolean} submitCount={formik.submitCount} />
            </div>
          </div>

          <div className="sticky bottom-0 bg-card border-t border-border -mx-6 px-6 py-4 mt-auto flex gap-3 justify-end z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-24"
            >
              {formik.isSubmitting || isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
