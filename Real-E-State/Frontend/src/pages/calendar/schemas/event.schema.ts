import * as Yup from "yup";

export const eventSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  description: Yup.string().optional(),
  start: Yup.date().required("Start date and time is required"),
  end: Yup.date()
    .required("End date and time is required")
    .min(Yup.ref("start"), "End date must be after start date"),
  type: Yup.string().oneOf(["task", "event", "meeting"]).required("Type is required"),
  allDay: Yup.boolean().default(false),
});

export type EventFormValues = Yup.InferType<typeof eventSchema>;

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  type: "task" | "event" | "meeting";
  allDay?: boolean;
}
