import { GoodService } from '../services/goodService.js';

export class GoodController {
    constructor() {
        this.goodModel = new GoodService();
    }

    async goodsbySale(req, res) {
        const email = req.userEmail;
        const offset = req.query.offset ? parseInt(req.query.offset) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const options = { offset, limit };

        if (!email) {
            const goods = await this.goodModel.getGoodsByDiscountСlassification("sale", options);
            return res.json(goods);
        }
        const goods = await this.goodModel.getGoodsByDiscountСlassificationUser(email, "sale", options);
        return res.json(goods);
    }

    async goodsbyDiscount(req, res) {
        const email = req.userEmail;
        const offset = req.query.offset ? parseInt(req.query.offset) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const options = { offset, limit };

        if (!email) {
            const goods = await this.goodModel.getGoodsByDiscountСlassification("discount", options);
            return res.json(goods);
        }
        const goods = await this.goodModel.getGoodsByDiscountСlassificationUser(email, "discount", options);
        return res.json(goods);
    }

    async getGoodById(req, res) {
        const id = req.params.id;
        const email = req.userEmail;

        if (!email) {
            const good = await this.goodModel.getGoodById(id);
            return res.json(good);
        }
        const good = await this.goodModel.getGoodByIdForUser(id, email);
        return res.json(good);
    }

    async getGoodsByCategory(req, res) {
        const { category, ...options } = req.body;
        const email = req.userEmail;

        if (!email) {
            const goods = await this.goodModel.getGoodsByCategory(req.body, options);
            return res.json(goods);
        }
        const goods = await this.goodModel.getGoodsByDiscountСlassificationUser(email, { category }, options);
        return res.json(goods);
    }

    async goodsbyIds(req, res) {
        const dto = req.body;
        const offset = req.query.offset ? parseInt(req.query.offset) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const options = { offset, limit };

        const goods = await this.goodModel.getGoodsByIds(dto, options);
        return res.json(goods);
    }

    async createSelers(req, res) {
        const dto = req.body
         await this.goodModel.createSelers(dto)
         return res.json({success: true, message: "Успешно!"})
    }
}