import { z } from "zod";

export const formSchema = z.object({
  label: z.string().min(1, { message: "Label is required" }),
  url: z.string().url().or(z.literal("")),
  parent_id: z.string().nullable().optional(),
  menu_position_id: z.string().nullable().optional(),
  id: z.string().nullable().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
