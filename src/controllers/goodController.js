import GoodService from '../services/goodService.js'; 
import { userEmail } from '../middlewares/emailMiddleware.js'; 

class GoodController {
    constructor() {
        this.goodService = new GoodService();
    }

    async goodsbySale(req, res) {
        const email = req.userEmail; 
        const offset = req.query.offset ? parseInt(req.query.offset) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const options = { offset, limit };

        if (!email) {
            const goods = await this.goodService.getGoodsByDiscountСlassification("sale", options);
            return res.json(goods);
        }
        const goods = await this.goodService.getGoodsByDiscountСlassificationUser(email, "sale", options);
        return res.json(goods);
    }

    async goodsbyDiscount(req, res) {
        const email = req.userEmail;
        const offset = req.query.offset ? parseInt(req.query.offset) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const options = { offset, limit };

        if (!email) {
            const goods = await this.goodService.getGoodsByDiscountСlassification("discount", options);
            return res.json(goods);
        }
        const goods = await this.goodService.getGoodsByDiscountСlassificationUser(email, "discount", options);
        return res.json(goods);
    }

    async getGoodById(req, res) {
        const id = req.params.id;
        const email = req.userEmail;

        if (!email) {
            const good = await this.goodService.getGoodById(id);
            return res.json(good);
        }
        const good = await this.goodService.getGoodByIdForUser(id, email);
        return res.json(good);
    }

    async getGoodsByCategory(req, res) {
        const { category, ...options } = req.body;
        const email = req.userEmail;

        if (!email) {
            const goods = await this.goodService.getGoodsByCategory(req.body, options);
            return res.json(goods);
        }
        const goods = await this.goodService.getGoodsByDiscountСlassificationUser(email, { category }, options);
        return res.json(goods);
    }

    async goodsbyIds(req, res) {
        const dto = req.body;
        const offset = req.query.offset ? parseInt(req.query.offset) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const options = { offset, limit };

        const goods = await this.goodService.getGoodsByIds(dto, options);
        return res.json(goods);
    }
}

export default GoodController; 