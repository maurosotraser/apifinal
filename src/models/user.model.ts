export interface User {
  id_usuario: number;
  username: string;
  hash_password: string;
  nombre_usuario: string;
  correo: string;
  telefono?: string;
  ind_estado: 'S' | 'N' | 'B';
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
}