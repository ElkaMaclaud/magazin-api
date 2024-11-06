import { GoodService } from '../services/goodService.js';

export class GoodController {
    constructor() {
        this.goodModel = new GoodService();
    }

    async goodsbySale(req, res) {
        try {
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
        } catch (error) {
            return res.status(403).json({ success: false, message: error })
        }
    }

    async goodsbyDiscount(req, res) {
        try {
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
        } catch (error) {
            return res.status(403).json({ success: false, message: error })
        }
    }

    async getGoodById(req, res) {
        try {
            const id = req.params.id;
            const email = req.userEmail;
            // if (!email) {
            //     const good = await this.goodModel.getGoodById(id);
            //     return res.json(good);
            // }
            const good = await this.goodModel.getGoodByIdForUser(id, email);
            return res.json(good);
        } catch (error) {
            return res.status(403).json({ success: false, message: error })
        }
    }

    async getGoodsByCategory(req, res) {
        try {
            const { category, ...options } = req.body;
            const email = req.userEmail;

            if (!email) {
                const goods = await this.goodModel.getGoodsByCategory(req.body, options);
                return res.json(goods);
            }
            const goods = await this.goodModel.getGoodsByDiscountСlassificationUser(email, { category }, options);
            return res.json(goods);
        } catch (error) {
            return res.status(403).json({ success: false, message: error })
        }
    }

    async goodsbyIds(req, res) {
        try {
            const dto = req.body;
            const offset = req.query.offset ? parseInt(req.query.offset) : undefined;
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            const options = { offset, limit };

            const goods = await this.goodModel.getGoodsByIds(dto, options);
            return res.json(goods);
        } catch (error) {
            return res.status(403).json({ success: false, message: error })
        }
    }

    async createSelers(req, res) {
        try {
            const dto = req.body
            await this.goodModel.createSelers(dto)
            return res.json({ success: true, message: "Успешно!" })
        } catch (error) {
            return res.status(403).json({ success: false, message: error })
        }
    }

    async getAllGoods(req, res) {
        try {
            return res.json(await this.goodModel.getAllGoods())
        } catch (error) {
            return res.status(403).json({ success: false, message: error })
        }
    }
}