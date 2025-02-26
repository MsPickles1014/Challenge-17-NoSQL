import { Router } from 'express';
import thoughtRoutes from './thought-routes.js';
import userRoutes from './user-routes.js';

const router = Router();

router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

export default router;