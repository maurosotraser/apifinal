export interface User {
  id_usuario: number;
  username: string;
  hash_password: string;
  nombre_usuario: string;
  correo: string;
  telefono: string | null;
  ind_estado: 'S' | 'N';
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
  ultimo_acceso: Date;
}

export interface Role {
  id_rol: number;
  nombre: string;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
}

export interface Action {
  id_accion: number;
  nombre: string;
  cod_tipo: string;
  htmlcode: string | null;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
}

export interface Owner {
  id_propietario: number;
  rut_propietario: number;
  run_propietario: string;
  nombre_propietario: string;
  apellido_propietario: string;
  email_propietario: string;
  telefono_propietario: string;
  direccion_propietario: string;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
}

export interface Membership {
  id_membresia: number;
  id_usuario: number;
  id_propietario: number;
  ind_membresia: string;
  fecha_vigencia: Date | null;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
}

export interface RoleMembership {
  id_membresia: number;
  id_rol: number;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
}

export interface ActionMembership {
  id_membresia: number;
  id_accion: number;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
}

export interface RoleSub {
  id_rol_sub: number;
  id_rol: number;
  id_accion: number;
  can_salect: string;
  can_insert: string;
  can_update: string;
  can_delete: string;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
}

export interface Token {
  id_token: number;
  id_usuario: number;
  token: string;
  fecha_creacion: Date;
  fecha_expiracion: Date;
  fecha_validacion: Date | null;
  ind_validado: string;
  inserted_by: string;
  inserted_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
}

export interface Audit {
  id_audit: number;
  id_usuario: number;
  accion: string;
  tabla: string;
  registro_id: number;
  datos_anteriores: string | null;
  datos_nuevos: string | null;
  ip_address: string;
  user_agent: string;
  fecha_audit: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nombre_usuario: string;
  correo: string;
  telefono?: string;
  inserted_by: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'hash_password'>;
} 