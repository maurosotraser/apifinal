import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER || 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const pool = new sql.ConnectionPool(config);

// Solo intentar conectar si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  pool.connect()
    .then(() => {
      console.log('Database connection successful');
    })
    .catch(err => {
      console.error('Error connecting to the database:', err);
      process.exit(1);
    });
}

export { pool }; 