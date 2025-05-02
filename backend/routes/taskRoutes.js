import express from "express"
import {protect,adminOnly} from "../middlewares/authMiddleware.js";
import { createTask, deleteTask, getDashboardData, getTasks, getTasksById, updateTask, updateTaskChecklist, updateTaskStatus } from "../controllers/taskControllers.js";

const router=express.Router()

router.get("/dashboard-data",protect,getDashboardData);
router.get("/user-dashboard-data",protect,getDashboardData);
router.get("/",protect,getTasks);
router.get("/:id",protect,getTasksById);
router.post("/",protect,adminOnly,createTask);
router.put("/:id",protect,updateTask);
router.delete("/:id",protect,adminOnly,deleteTask);
router.put("/:id/status",protect,updateTaskStatus);
router.put("/:id/todo",protect,updateTaskChecklist);

export default router;