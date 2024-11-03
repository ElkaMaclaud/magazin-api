import express from 'express';
import { GoodController } from '../controllers/goodController.js';
import userEmail from '../middlewares/emailMiddleware.js';

const router = express.Router();
const goodController = new GoodController();

router.get('/goodsbySale', userEmail, (req, res) => goodController.goodsbySale(req, res));
router.get('/goodsbyDiscount', userEmail, (req, res) => goodController.goodsbyDiscount(req, res));
router.get('/:id', userEmail, (req, res) => goodController.getGoodById(req, res));
router.post('/goodsByCategory', userEmail, (req, res) => goodController.getGoodsByCategory(req, res));
router.post('/goodsbyIds', (req, res) => goodController.goodsbyIds(req, res));
router.post('/createSelers', (req, res) => goodController.createSelers(req, res))

export default router;