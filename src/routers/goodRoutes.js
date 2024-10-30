import express from 'express';
import GoodController from './goodController.js';
import { JwtAuthGuard } from './guards.js';

const router = express.Router();
const goodController = new GoodController();


router.get('/goodsbySale', JwtAuthGuard, (req, res) => goodController.goodsbySale(req, res));
router.get('/goodsbyDiscount', JwtAuthGuard, (req, res) => goodController.goodsbyDiscount(req, res));
router.get('/:id', JwtAuthGuard, (req, res) => goodController.getGoodById(req, res));
router.post('/goodsByCategory', JwtAuthGuard, (req, res) => goodController.getGoodsByCategory(req, res));

router.post('/goodsbyIds', (req, res) => goodController.goodsbyIds(req, res));

export default router; 