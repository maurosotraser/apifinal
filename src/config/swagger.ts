import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sotraser API Documentation',
      version: '1.0.0',
      description: 'API documentation for Sotraser application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'hash_password', 'nombre_usuario', 'correo', 'ind_estado', 'inserted_by', 'ultimo_acceso'],
          properties: {
            id_usuario: {
              type: 'integer',
              description: 'User ID',
            },
            username: {
              type: 'string',
              description: 'Username',
            },
            hash_password: {
              type: 'string',
              description: 'Hashed password',
            },
            nombre_usuario: {
              type: 'string',
              description: 'Full name of the user',
            },
            correo: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            telefono: {
              type: 'string',
              nullable: true,
              description: 'User phone number',
            },
            ultimo_acceso: {
              type: 'string',
              format: 'date-time',
              description: 'Last access timestamp',
            },
            ind_estado: {
              type: 'string',
              enum: ['S', 'N'],
              description: 'User status (S: Active, N: Inactive)',
            },
            inserted_by: {
              type: 'string',
              description: 'User who created the record',
            },
            inserted_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updated_by: {
              type: 'string',
              nullable: true,
              description: 'User who last updated the record',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Last update timestamp',
            },
          },
        },
        Role: {
          type: 'object',
          required: ['nombre', 'inserted_by'],
          properties: {
            id_rol: {
              type: 'integer',
              description: 'Role ID',
            },
            nombre: {
              type: 'string',
              description: 'Role name',
            },
            inserted_by: {
              type: 'string',
              description: 'User who created the record',
            },
            inserted_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updated_by: {
              type: 'string',
              nullable: true,
              description: 'User who last updated the record',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Last update timestamp',
            },
          },
        },
        Action: {
          type: 'object',
          required: ['nombre', 'cod_tipo', 'inserted_by'],
          properties: {
            id_accion: {
              type: 'integer',
              description: 'Action ID',
            },
            nombre: {
              type: 'string',
              description: 'Action name',
            },
            cod_tipo: {
              type: 'string',
              description: 'Action type code',
            },
            htmlcode: {
              type: 'string',
              nullable: true,
              description: 'HTML code for the action',
            },
            inserted_by: {
              type: 'string',
              description: 'User who created the record',
            },
            inserted_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updated_by: {
              type: 'string',
              nullable: true,
              description: 'User who last updated the record',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Last update timestamp',
            },
          },
        },
        Owner: {
          type: 'object',
          required: ['rut_propietario', 'run_propietario', 'nombre_propietario', 'apellido_propietario', 'email_propietario', 'telefono_propietario', 'direccion_propietario', 'inserted_by'],
          properties: {
            id_propietario: {
              type: 'integer',
              description: 'Owner ID',
            },
            rut_propietario: {
              type: 'integer',
              description: 'Owner RUT number',
            },
            run_propietario: {
              type: 'string',
              description: 'Owner RUN',
            },
            nombre_propietario: {
              type: 'string',
              description: 'Owner first name',
            },
            apellido_propietario: {
              type: 'string',
              description: 'Owner last name',
            },
            email_propietario: {
              type: 'string',
              format: 'email',
              description: 'Owner email',
            },
            telefono_propietario: {
              type: 'string',
              description: 'Owner phone number',
            },
            direccion_propietario: {
              type: 'string',
              description: 'Owner address',
            },
            inserted_by: {
              type: 'string',
              description: 'User who created the record',
            },
            inserted_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updated_by: {
              type: 'string',
              nullable: true,
              description: 'User who last updated the record',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Last update timestamp',
            },
          },
        },
        Membership: {
          type: 'object',
          required: ['id_usuario', 'id_propietario', 'ind_membresia', 'inserted_by'],
          properties: {
            id_membresia: {
              type: 'integer',
              description: 'Membership ID',
            },
            id_usuario: {
              type: 'integer',
              description: 'User ID',
            },
            id_propietario: {
              type: 'integer',
              description: 'Owner ID',
            },
            ind_membresia: {
              type: 'string',
              description: 'Membership indicator',
            },
            fecha_vigencia: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Membership validity date',
            },
            inserted_by: {
              type: 'string',
              description: 'User who created the record',
            },
            inserted_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updated_by: {
              type: 'string',
              nullable: true,
              description: 'User who last updated the record',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Last update timestamp',
            },
          },
        },
        Token: {
          type: 'object',
          required: ['id_usuario', 'token', 'fecha_creacion', 'fecha_expiracion', 'ind_validado', 'inserted_by'],
          properties: {
            id_token: {
              type: 'integer',
              description: 'Token ID',
            },
            id_usuario: {
              type: 'integer',
              description: 'User ID',
            },
            token: {
              type: 'string',
              description: 'Token string',
            },
            fecha_creacion: {
              type: 'string',
              format: 'date-time',
              description: 'Token creation date',
            },
            fecha_expiracion: {
              type: 'string',
              format: 'date-time',
              description: 'Token expiration date',
            },
            fecha_validacion: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Token validation date',
            },
            ind_validado: {
              type: 'string',
              description: 'Validation indicator',
            },
            inserted_by: {
              type: 'string',
              description: 'User who created the record',
            },
            inserted_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updated_by: {
              type: 'string',
              nullable: true,
              description: 'User who last updated the record',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Last update timestamp',
            },
          },
        },
        Audit: {
          type: 'object',
          required: ['id_usuario', 'accion', 'tabla', 'registro_id', 'ip_address', 'user_agent', 'fecha_audit'],
          properties: {
            id_audit: {
              type: 'integer',
              description: 'Audit ID',
            },
            id_usuario: {
              type: 'integer',
              description: 'User ID',
            },
            accion: {
              type: 'string',
              description: 'Action performed',
            },
            tabla: {
              type: 'string',
              description: 'Table affected',
            },
            registro_id: {
              type: 'integer',
              description: 'Record ID',
            },
            datos_anteriores: {
              type: 'string',
              nullable: true,
              description: 'Previous data',
            },
            datos_nuevos: {
              type: 'string',
              nullable: true,
              description: 'New data',
            },
            ip_address: {
              type: 'string',
              description: 'IP address',
            },
            user_agent: {
              type: 'string',
              description: 'User agent',
            },
            fecha_audit: {
              type: 'string',
              format: 'date-time',
              description: 'Audit timestamp',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'User username',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'password', 'nombre_usuario', 'correo', 'inserted_by'],
          properties: {
            username: {
              type: 'string',
              description: 'User username',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
            nombre_usuario: {
              type: 'string',
              description: 'User full name',
            },
            correo: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            telefono: {
              type: 'string',
              nullable: true,
              description: 'User phone number',
            },
            inserted_by: {
              type: 'string',
              description: 'Username of the user creating the account',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          required: ['token', 'user'],
          properties: {
            token: {
              type: 'string',
              description: 'JWT access token',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options); 