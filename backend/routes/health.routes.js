import express from 'express';
import { getHealth } from '../controllers/Health.controller.js';

const router = express.Router();

router.get('/', getHealth);

export default router;