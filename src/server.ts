import { app } from './app';
import { config } from './config/app';
import { pool } from './config/database';

const startServer = async () => {
  try {
    // Test database connection
    await pool.connect();
    console.log('Database connection successful');

    // Start server
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.environment}`);
      console.log(`API Documentation available at http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 