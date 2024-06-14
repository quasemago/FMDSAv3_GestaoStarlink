import {Router} from "express";
import ClientController from "../controller/ClientController.js";
import loginValidation from "../middleware/loginValidation.js";

const router = Router();
router.get("/", loginValidation, ClientController.getAll);

export default router;