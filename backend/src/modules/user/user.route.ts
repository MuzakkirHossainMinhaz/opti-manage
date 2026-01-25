import { Router } from "express";
import checkValidation from "../../middlewares/checkValidation";
import { UserControllers } from "./user.controller";
import userValidationSchema from "./user.validation";

const router = Router();

router.post("/register", checkValidation(userValidationSchema), UserControllers.createUser);

export const UserRoutes = router;
