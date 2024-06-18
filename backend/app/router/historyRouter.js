import {Router} from "express";
import {adminValidation, loginValidation} from "../middleware/routerValidations.js";
import HistoryController from "../controller/HistoryController.js";

const router = Router();

router.post("/self/sessions", loginValidation, HistoryController.saveSelfSession);
// Admin routers.
router.get("/:id/:type", [loginValidation, adminValidation], HistoryController.getById);
router.delete("/:id/:type", [loginValidation, adminValidation], HistoryController.deleteById);
export default router;