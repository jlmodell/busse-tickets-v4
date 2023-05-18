import { z } from "zod";

const sessionSchema = z.object({
  user: userSchema,
});

export type Session = z.infer<typeof sessionSchema>;

const userSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  image: z.string().optional(),
  role: z.union([z.literal("admin"), z.literal("user")]).optional(),
});

export type User = z.infer<typeof userSchema>;
