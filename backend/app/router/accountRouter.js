import {Router} from "express";
import AccountController from "../controller/AccountController.js";

const router = Router();
router.post(`/`, AccountController.login);

export default router;