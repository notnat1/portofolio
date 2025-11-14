import { z } from 'zod/v4';

export const Person = z.object({
  name: z.string().trim().min(1),
  age: z.number().positive().max(150),
});
export type Person = z.infer<typeof Person>;

export const Project = z.object({
  id: z.number().positive(),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  image_url: z.string().url(),
  project_url: z.string().url(),
  source_code_url: z.string().url(),
  tech_used: z.string(),
});
export type Project = z.infer<typeof Project>;

export const ContactMessage = z.object({
  id: z.number().positive(),
  full_name: z.string().trim().min(1),
  email: z.string().email(),
  message: z.string().trim().min(1),
});
export type ContactMessage = z.infer<typeof ContactMessage>;
