import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || '',
  database: process.env.DB_NAME,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

export const pool = new sql.ConnectionPool(config);

export const connectDB = async () => {
  try {
    console.log('Intentando conectar con la configuración:', {
      user: config.user,
      server: config.server,
      database: config.database,
      port: config.port
    });
    await pool.connect();
    console.log('Conectado a SQL Server en Google Cloud');
  } catch (error) {
    console.error('Error de conexión:', error);
    throw error;
  }
};