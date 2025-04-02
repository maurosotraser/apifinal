export interface Action {
  id_accion: number;
  nombre: string;
  cod_tipo: string;
  htmlcode: string;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
} 