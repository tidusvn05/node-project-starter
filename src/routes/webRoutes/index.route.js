import express from 'express';
import homeRoutes from './home.route';


const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);


// mount auth routes at /auth
router.use('/', homeRoutes);

export default router;
