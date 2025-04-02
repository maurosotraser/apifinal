export interface Membership {
  id_membresia: number;
  id_usuario: number;
  id_propietario: number;
  ind_membresia: string;
  fecha_vigencia: Date;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
} 