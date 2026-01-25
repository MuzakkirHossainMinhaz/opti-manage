import { Router } from "express";
import auth from "../../middlewares/auth";
import checkValidation from "../../middlewares/checkValidation";
import { EyeGlassControllers } from "./eyeGlass.controller";
import { eyeGlassValidationSchemas } from "./eyeGlass.validation";

const router = Router();

router.post(
  "/create",
  auth(),
  checkValidation(eyeGlassValidationSchemas.createEyeGlassSchema),
  EyeGlassControllers.createEyeGlass,
);
router.delete("/", auth(), EyeGlassControllers.deleteEyeGlassByIds);
router.delete("/delete-all", auth(), EyeGlassControllers.deleteAllEyeGlasses);
router.put(
  "/:eyeGlassId",
  auth(),
  checkValidation(eyeGlassValidationSchemas.updateEyeGlassSchema),
  EyeGlassControllers.updateEyeGlassById,
);
router.get("/", auth(), EyeGlassControllers.getAllEyeGlasses);
router.get("/:eyeGlassId", auth(), EyeGlassControllers.getEyeGlassById);

export const EyeGlassRoutes = router;
