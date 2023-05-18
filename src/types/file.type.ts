import { z } from "zod";

const fileListSchema = z.object({
  key: z.string(),
  url: z.string(),
  filename: z.string(),
  id: z.string().optional(),
  date: z.string().optional(),
});

export type FileList = z.infer<typeof fileListSchema>;
