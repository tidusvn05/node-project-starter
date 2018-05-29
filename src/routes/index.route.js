import express from 'express';
import apiRoutes from './apiRoutes/index.route';
import webRoutes from './webRoutes/index.route';

const router = express.Router(); // eslint-disable-line new-cap

// router.get('');
// For web
router.use('/', webRoutes);

// For api
router.use('/', apiRoutes);


export default router;
