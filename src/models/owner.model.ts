export interface Owner {
  id_propietario: number;
  rut_propietario: number;
  run_propietario: string;
  nombre_propietario: string;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
  ind_estado: string;
} 