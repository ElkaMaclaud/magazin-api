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
      const statusCode = err.status || 401;
      return res.status(statusCode).json({
        message: err.message,
      });
    }
  }


  async getCart(req, res) {
    try {
    const email = req.userEmail;
    const { offset, limit } = req.query;
    const options = { offset, limit };
    return res.json(await this.userService.getCart(email, options));
  } catch(error) {
    return res.status(403).json({ success: false, message: error })
  }
}

  async getFavorites(req, res) {
  try {
    const email = req.userEmail;
    const { offset, limit } = req.query;
    const options = { offset, limit };
    return res.json(await this.userService.getFavorites(email, options));
  } catch (error) {
    return res.status(403).json({ success: false, message: error })
  }
}

  async getOrders(req, res) {
  try {
    const email = req.userEmail;
    const { offset, limit } = req.query;
    const options = { offset, limit };
    return res.json(await this.userService.getOrders(email, options));
  } catch (error) {
    return res.status(403).json({ success: false, message: error })
  }
}

  async selectAll(req, res) {
  try {
    const email = req.userEmail;
    const dto = req.body;
    return res.json(await this.userService.selectAll(email, dto.on));
  } catch (error) {
    return res.status(403).json({ success: false, message: error })
  }
}

  async getUserData(req, res) {
  try {
    const email = req.userEmail;
    return res.json(await this.userService.getUserData(email));
  } catch (error) {
    return res.status(403).json({ success: false, message: error })
  }
}

  async updateUserData(req, res) {
  try {
    const email = req.userEmail;
    const dto = req.body;
    const result = await this.userService.updateUserData(dto, email);
    return res.json(result);
  } catch (error) {
    return res.status(403).json({ success: false, message: error })
  }
}

  async createNewChat(req, res) {
    try {
      const dto = req.body;
      const result = await this.userService.createNewChat(dto)
      return res.json(result)
    } catch (error) {
      return res.status(403).json({ success: false, message: error })
    }
  }

  async updateDelivery(req, res) {
    try {
      const email = req.userEmail;
      const dto = req.body;
      const result = await this.userService.updateDelivery(dto, email);
      return res.json(result);
    } catch (error) {
      return res.status(403).json({ success: false, message: error })
    }
  }

  async deleteSelected(req, res) {    
      try {
        const email = req.userEmail;
        const result = await this.userService.deleteSelected(email);
        return res.json(result);
      } catch (error) {
        return res.status(403).json({ success: false, message: error })
      }
    }

  async addToCart(req, res) {
      try {
        const email = req.userEmail;
        const dto = req.body;
        const id = dto.id;
        return res.json(await this.userService.addToCart(id, email));
      } catch (error) {
        return res.status(403).json({ success: false, message: error })
      }
    }

  async addToCartGetAuto(req, res) {
      try {
        const dto = req.body;
        const id = dto.id;
        return res.json(await this.userService.addToCart(id));
      } catch (error) {
        return res.status(403).json({ success: false, message: error })
      }
    }

  async toggleSelect(req, res) {
      try {
        const email = req.userEmail;
        const dto = req.body;
        const id = dto.id;
        return res.json(await this.userService.toggleSelect(email, id));
      } catch (error) {
        return res.status(403).json({ success: false, message: error })
      }
    }

  async addFavorites(req, res) {
      try {
        const email = req.userEmail;
        const dto = req.body;
        const id = dto.id;
        return res.json(await this.userService.toggleFavorites(id, email));
      } catch (error) {
        return res.status(403).json({ success: false, message: error })
      }
    }

  async toggleFavoritesGetAuto(req, res) {
      try {
        const dto = req.body;
        const id = dto.id;
        return res.json(await this.userService.toggleFavorites(id));
      } catch (error) {
        return res.status(403).json({ success: false, message: error })
      }
    }

  async addOrder(req, res) {
      try {
        const email = req.userEmail;
        const dto = req.body;
        return res.json(await this.userService.addOrder(email, dto.ids));
      } catch (error) {
        return res.status(403).json({ success: false, message: error })
      }
    }

  async subFromCart(req, res) {
      try {
        const email = req.userEmail;
        const dto = req.body;
        const id = dto.id;
        return res.json(await this.userService.subFromCart(email, id));
      } catch (error) {
        return res.status(403).json({ success: false, message: error })
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
      catch (error) {
        return res.status(403).json({ success: false, message: error })
      }
    }
  }