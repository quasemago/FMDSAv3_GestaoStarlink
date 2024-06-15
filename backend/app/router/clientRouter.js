import {Router} from "express";
import ClientController from "../controller/ClientController.js";
import {adminValidation, loginValidation} from "../middleware/routerValidations.js";

const router = Router();

// Admin routers.
router.get("/", loginValidation, ClientController.getAll);
router.get("/:id", [loginValidation, adminValidation], ClientController.getById);
router.post("/create", [loginValidation, adminValidation], ClientController.create);
router.put("/:id/update", [loginValidation, adminValidation], ClientController.update);
router.delete("/:id/delete", [loginValidation, adminValidation], ClientController.delete);

export default router;