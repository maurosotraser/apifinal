# Sotraser API

API for the Sotraser application built with Node.js, Express, TypeScript, and MySQL.

## Features

- User authentication with JWT
- Role-based access control
- Action management
- Owner management
- Membership management
- Token management
- Audit logging
- Swagger API documentation

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sotraser-api.git
cd sotraser-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Database
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=sotraser_db

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=*

# Logging
LOG_LEVEL=dev
```

4. Create the database and tables:
```sql
CREATE DATABASE sotraser_db;
USE sotraser_db;

-- Create tables (SQL scripts will be provided separately)
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:3000 (or the port specified in your .env file).

## Building for Production

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
http://localhost:3000/api-docs

## Testing

Run tests:
```bash
npm test
```

## Linting and Formatting

- Lint the code:
```bash
npm run lint
```

- Format the code:
```bash
npm run format
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript type definitions
├── app.ts         # Express app setup
└── server.ts      # Server entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. "# apifinal" 
