import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(150),
    password: z.string().min(8).max(128),
    role: z.enum(['admin', 'owner', 'customer']),
  })
  .strict();

export type CreateUserInput = z.infer<typeof createUserSchema>;