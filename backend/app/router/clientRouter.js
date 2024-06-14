import {Router} from "express";
import ClientController from "../controller/ClientController.js";
import loginValidation from "../middleware/loginValidation.js";
import adminValidation from "../middleware/adminValidation.js";

const router = Router();
router.get("/", [loginValidation, adminValidation], ClientController.getAll);
router.get("/:id", [loginValidation, adminValidation], ClientController.getById);
router.post("/create", [loginValidation, adminValidation], ClientController.create);

export default router;