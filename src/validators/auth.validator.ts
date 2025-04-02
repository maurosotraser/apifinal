import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  nombre_usuario: z.string().min(3).max(100),
  correo: z.string().email(),
  telefono: z.string().optional(),
  ind_estado: z.enum(['S', 'N', 'B']).default('S'),
  inserted_by: z.string().optional()
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const validateRegistration = (data: unknown) => {
  return registerSchema.parse(data);
};

export const validateLogin = (data: unknown) => {
  return loginSchema.parse(data);
};