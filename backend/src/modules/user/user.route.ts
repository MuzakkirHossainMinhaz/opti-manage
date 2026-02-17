import { Router } from "express";
import auth from "../../middlewares/auth";
import checkValidation from "../../middlewares/checkValidation";
import { UserControllers } from "./user.controller";
import userValidationSchema from "./user.validation";
import { changePasswordValidationSchema, updateProfileValidationSchema } from "./userProfile.validation";

const router = Router();

router.post("/register", auth("manager"), checkValidation(userValidationSchema), UserControllers.createUser);
router.get("/users", auth("manager"), UserControllers.getAllUsers);
router.delete("/users/:id", auth("manager"), UserControllers.deleteUser);
router.patch(
  "/:id/profile",
  auth(),
  checkValidation(updateProfileValidationSchema),
  UserControllers.updateProfile,
);
router.patch(
  "/:id/change-password",
  auth(),
  checkValidation(changePasswordValidationSchema),
  UserControllers.changePassword,
);

export const UserRoutes = router;
