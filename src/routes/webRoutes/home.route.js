import express from 'express';
// import validate from 'express-validation';
// import Joi from 'joi';
import homeCtrl from '../../controllers/home.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /- Homepage */
  .get(homeCtrl.index);


export default router;
