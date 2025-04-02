import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  nombre_usuario: z.string().min(3).max(100),
  correo: z.string().email(),
  ind_estado: z.enum(['A', 'B']).default('A')
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