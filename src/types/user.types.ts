export interface User {
  id_usuario: number;
  username: string;
  password: string;
  nombre_usuario: string;
  correo: string;
  telefono: string | null;
  ind_estado: 'A' | 'B';
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
  ultimo_acceso: Date;
  roles?: string[];
} 