import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import employeeRoutes from './modules/employee/employee.routes';
import { modelGroupRoutes, modelRoutes } from './modules/model/model.routes';
import specificationRoutes from './modules/specification/specification.routes';
import drawingRoutes from './modules/drawing/drawing.routes';
import checkItemRoutes from './modules/check-item/check-item.routes';
import orderingRoutes from './modules/ordering/ordering.routes';
import adminRoutes from './modules/admin/admin.routes';
import settingsRoutes from './modules/settings/settings.routes';

const app = express();

// Middleware
app.use(helmet());
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/api/v1/health-check', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/model-groups', modelGroupRoutes);
app.use('/api/v1/models', modelRoutes);
app.use('/api/v1/specifications', specificationRoutes);
app.use('/api/v1/drawings', drawingRoutes);
app.use('/api/v1/check-items', checkItemRoutes);
app.use('/api/v1/orderings', orderingRoutes);
app.use('/api/v1/admins', adminRoutes);
app.use('/api/v1/settings', settingsRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
