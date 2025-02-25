import { UserService } from "../services/userService.js";
import { ALREADY_REGISTERED_ERROR } from "../constants.js";
import { BadRequestException } from "../errors/BadRequestException.js"
import { errorMessageServer } from "../consts.js";

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
      const user = await this.userService.validateUser(res, login, password);
      return res.json(await this.userService.login(user));
    } catch (err) {
      const statusCode = err.status || 401;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }


  async getCart(req, res) {
    try {
      const email = req.userEmail;
      const { offset, limit } = req.query;
      const options = { offset, limit };
      return res.json(await this.userService.getCart(email, options));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async getFavorites(req, res) {
    try {
      const email = req.userEmail;
      const { offset, limit } = req.query;
      const options = { offset, limit };
      return res.json(await this.userService.getFavorites(email, options));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async getOrders(req, res) {
    try {
      const email = req.userEmail;
      const { offset, limit } = req.query;
      const options = { offset, limit };
      return res.json(await this.userService.getOrders(email, options));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async selectAll(req, res) {
    try {
      const email = req.userEmail;
      const dto = req.body;
      return res.json(await this.userService.selectAll(email, dto.on));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async getUserData(req, res) {
    try {
      const email = req.userEmail;
      return res.json(await this.userService.getUserData(email));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async getAllChats(req, res) {
    try {
      const email = req.userEmail;
      return res.json(await this.userService.getAllChats(email));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async updateUserData(req, res) {
    try {
      const email = req.userEmail;
      const dto = req.body;
      const result = await this.userService.updateUserData(dto, email);
      return res.json(result);
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async createNewChat(req, res) {
    try {
      const dto = req.body;
      const result = await this.userService.createNewChat(dto)
      return res.json(result)
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async updateDelivery(req, res) {
    try {
      const email = req.userEmail;
      const dto = req.body;
      const result = await this.userService.updateDelivery(dto, email);
      return res.json(result);
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async deleteSelected(req, res) {
    try {
      const email = req.userEmail;
      const result = await this.userService.deleteSelected(email);
      return res.json(result);
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async addToCart(req, res) {
    try {
      const email = req.userEmail;
      const dto = req.body;
      const id = dto.id;
      return res.json(await this.userService.addToCart(id, email));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async addToCartGetAuto(req, res) {
    try {
      const dto = req.body;
      const id = dto.id;
      return res.json(await this.userService.addToCart(id));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async toggleSelect(req, res) {
    try {
      const email = req.userEmail;
      const dto = req.body;
      const id = dto.id;
      return res.json(await this.userService.toggleSelect(email, id));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async addFavorites(req, res) {
    try {
      const email = req.userEmail;
      const dto = req.body;
      const id = dto.id;
      return res.json(await this.userService.toggleFavorites(id, email));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async toggleFavoritesGetAuto(req, res) {
    try {
      const dto = req.body;
      const id = dto.id;
      return res.json(await this.userService.toggleFavorites(id));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async addOrder(req, res) {
    try {
      const email = req.userEmail;
      const dto = req.body;
      return res.json(await this.userService.addOrder(email, dto.ids));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async subFromCart(req, res) {
    try {
      const email = req.userEmail;
      const dto = req.body;
      const id = dto.id;
      return res.json(await this.userService.subFromCart(email, id));
    } catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }

  async removeFromCart(req, res) {
    try {
      const email = req.userEmail;
      const dto = req.body;
      const id = dto.id;
      const result = await this.userService.removeFromCart(email, id);
      return res.json(result);
    }
    catch (err) {
      const statusCode = err.status || 500;
      return res.status(statusCode).json({
        success: false, 
        message: err.message || errorMessageServer,
      });
    }
  }
}