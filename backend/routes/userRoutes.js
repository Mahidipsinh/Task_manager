import express from "express"
import { getUsers, getUserById } from "../controllers/userControllers.js";
import { adminOnly,protect } from "../middlewares/authMiddleware.js"
const router=express.Router()

router.get("/",protect,adminOnly,getUsers);
router.get("/:id",protect,getUserById);

export default router;