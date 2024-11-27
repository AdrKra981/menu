import { z } from "zod";

export const formSchema = z.object({
  label: z.string({ message: "Label is required" }),
  url: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
