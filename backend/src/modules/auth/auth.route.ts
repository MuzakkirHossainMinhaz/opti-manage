import { Router } from "express";
import checkValidation from "../../middlewares/checkValidation";
import { AuthControllers } from "./auth.controller";
import { authValidationSchemas } from "./auth.validation";

const router = Router();

router.post("/login", checkValidation(authValidationSchemas.authLoginValidationSchema), AuthControllers.loginUser);

export const AuthRoutes = router;
