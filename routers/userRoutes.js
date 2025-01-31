import express from "express";
import { UserController } from "../controllers/userController.js"; 
import  auth  from "../middlewares/authMiddleware.js"; 

const router = express.Router();
const userController = new UserController();

router.post("/auth/register", (req, res) => userController.register(req, res));
router.post("/auth/login", (req, res) => userController.login(req, res));
router.patch("/addToCartGetAuto", (req, res) => userController.addToCartGetAuto(req, res));
router.patch("/toggleFavoritesGetAuto", (req, res) => userController.toggleFavoritesGetAuto(req, res));

router.use(auth); 

router.get("/cart", (req, res) => userController.getCart(req, res));
router.get("/favorites", (req, res) => userController.getFavorites(req, res));
router.get("/orders", (req, res) => userController.getOrders(req, res));
router.delete("/deleteSelected", (req, res) => userController.deleteSelected(req, res));
router.patch("/addToCart", (req, res) => userController.addToCart(req, res));
router.patch("/toggleSelect", (req, res) => userController.toggleSelect(req, res));
router.patch("/toggleFavorites", (req, res) => userController.addFavorites(req, res));
router.patch("/selectAll", (req, res) => userController.selectAll(req, res));
router.patch("/subFromCart", (req, res) => userController.subFromCart(req, res));
router.patch("/removeFromCart", (req, res) => userController.removeFromCart(req, res));
router.get("/userData", (req, res) => userController.getUserData(req, res));
router.get("/getAllChats", (req, res) => userController.getAllChats(req, res));
router.post("/createNewChat", (req, res) => userController.createNewChat(req, res));
router.patch("/updateUserData", (req, res) => userController.updateUserData(req, res));
router.patch("/changeDelivery", (req, res) => userController.updateDelivery(req, res));
router.patch("/buy", (req, res) => userController.addOrder(req, res));


export default router;