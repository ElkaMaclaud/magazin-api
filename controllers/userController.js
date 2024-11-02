import { UserService } from "../services/userService.js";
import { ALREADY_REGISTERED_ERROR } from "../constants.js";
import { BadRequestException } from "../errors/BadRequestException.js"

export class UserController {
  constructor() {
    this.userService = new UserService();
  }
  async register(req, res) {
    const dto = req.body;
    const user = await this.userService.findUser(dto.email);
    if (user) {
      return new BadRequestException(res, ALREADY_REGISTERED_ERROR);
    }
    return res.json(await this.userService.registerUser(dto));
  }

  async login(req, res) {
    const { email: login, password } = req.body;
    try {
      const { email, _id } = await this.userService.validateUser(res, login, password);
      return res.json(await this.userService.login(email, _id));
    } catch (err) {
      return res.status(err.status).json({
        message: err.message,
      });
    }
  }


  async getCart(req, res) {
    const email = req.userEmail;
    const { offset, limit } = req.query;
    const options = { offset, limit };
    return res.json(await this.userService.getCart(email, options));
  }

  async getFavorites(req, res) {
    const email = req.userEmail;
    const { offset, limit } = req.query;
    const options = { offset, limit };
    return res.json(await this.userService.getFavorites(email, options));
  }

  async getOrders(req, res) {
    const email = req.userEmail;
    const { offset, limit } = req.query;
    const options = { offset, limit };
    return res.json(await this.userService.getOrders(email, options));
  }

  async selectAll(req, res) {
    const email = req.userEmail;
    const dto = req.body;
    return res.json(await this.userService.selectAll(email, dto.on));
  }

  async getUserData(req, res) {
    const email = req.userEmail;
    return res.json(await this.userService.getUserData(email));
  }

  async getUserChats(req, res) {
    const id = req.params.id
    return res.json(await this.userService.getUserChats(id)); 
  };

  async updateUserData(req, res) {
    const email = req.userEmail;
    const dto = req.body;
    const result = await this.userService.updateUserData(dto, email);
    return res.json(result);
  }

  async createNewChat(req, res) {
    // const dto = req.body;
    // const 
  }

  async updateDelivery(req, res) {
    const email = req.userEmail;
    const dto = req.body;
    const result = await this.userService.updateDelivery(dto, email);
    return res.json(result);
  }

  async deleteSelected(req, res) {
    const email = req.userEmail;
    const result = await this.userService.deleteSelected(email);
    return res.json(result);
  }

  async addToCart(req, res) {
    const email = req.userEmail;
    const dto = req.body;
    const id = dto.id;
    return res.json(await this.userService.addToCart(id, email));
  }

  async addToCartGetAuto(req, res) {
    const dto = req.body;
    const id = dto.id;
    return res.json(await this.userService.addToCart(id));
  }

  async toggleSelect(req, res) {
    const email = req.userEmail;
    const dto = req.body;
    const id = dto.id;
    return res.json(await this.userService.toggleSelect(email, id));
  }

  async addFavorites(req, res) {
    const email = req.userEmail;
    const dto = req.body;
    const id = dto.id;
    return res.json(await this.userService.toggleFavorites(id, email));
  }

  async toggleFavoritesGetAuto(req, res) {
    const dto = req.body;
    const id = dto.id;
    return res.json(await this.userService.toggleFavorites(id));
  }

  async addOrder(req, res) {
    const email = req.userEmail;
    const dto = req.body;
    return res.json(await this.userService.addOrder(email, dto.ids));
  }

  async subFromCart(req, res) {
    const email = req.userEmail;
    const dto = req.body;
    const id = dto.id;
    return res.json(await this.userService.subFromCart(email, id));
  }

  async removeFromCart(req, res) {
    const email = req.userEmail;
    const dto = req.body;
    const id = dto.id;
    const result = await this.userService.removeFromCart(email, id);
    return res.json(result);
  }
}