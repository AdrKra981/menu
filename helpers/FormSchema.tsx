import { z } from "zod";

export const formSchema = z.object({
  label: z.string({ message: "Label is required" }),
  url: z.string().optional(),
  parent_id: z.string().nullable().optional(),
  menu_position_id: z.string().nullable().optional(),
  id: z.string().nullable().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
