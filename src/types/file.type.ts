import { z } from "zod";

const fileListSchema = z.object({
  key: z.string(),
  url: z.string(),
  filename: z.string(),
});

export type FileList = z.infer<typeof fileListSchema>;
