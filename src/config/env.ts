import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Workspace scripts run with `backend/` as their working directory, while the
// shared configuration lives at the repository root.
config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../.env') });
export const env = { port: Number(process.env.PORT || 4000), databaseUrl: process.env.DATABASE_URL || '', jwtSecret: process.env.JWT_SECRET || 'development-only-change-me', jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h', frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173' };
