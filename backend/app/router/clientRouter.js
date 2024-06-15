import {Router} from "express";
import ClientController from "../controller/ClientController.js";
import {adminValidation, loginValidation} from "../middleware/routerValidations.js";

const router = Router();

// Client routers.
router.get("/self", loginValidation, ClientController.getSelfDetails);
router.put("/self/update", loginValidation, ClientController.updateSelfDetails);
router.put("/self/update-password", loginValidation, ClientController.updateSelfPassword);

// Admin routers.
router.get("/", loginValidation, ClientController.getAll);
router.get("/:id", [loginValidation, adminValidation], ClientController.getById);
router.post("/create", [loginValidation, adminValidation], ClientController.create);
router.put("/:id/update", [loginValidation, adminValidation], ClientController.update);
router.delete("/:id/delete", [loginValidation, adminValidation], ClientController.delete);

export default router;