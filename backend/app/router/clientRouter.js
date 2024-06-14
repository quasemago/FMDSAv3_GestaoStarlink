import {Router} from "express";
import ClientController from "../controller/ClientController.js";
import loginValidation from "../middleware/loginValidation.js";
import adminValidation from "../middleware/adminValidation.js";

const router = Router();

// Admin routers.
router.get("/", [loginValidation, adminValidation], ClientController.getAll);
router.get("/:id", [loginValidation, adminValidation], ClientController.getById);
router.post("/create", [loginValidation, adminValidation], ClientController.create);
router.put("/:id/update", [loginValidation, adminValidation], ClientController.update);
router.delete("/:id/delete", [loginValidation, adminValidation], ClientController.delete);

export default router;