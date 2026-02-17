import { Router } from "express";
import auth from "../../middlewares/auth";
import checkValidation from "../../middlewares/checkValidation";
import { OwnershipRequestControllers } from "./ownershipRequest.controller";
import { ownershipRequestValidationSchemas } from "./ownershipRequest.validation";

const router = Router();

router.post(
  "/",
  auth(),
  checkValidation(ownershipRequestValidationSchemas.createOwnershipRequestSchema),
  OwnershipRequestControllers.createOwnershipRequest,
);

router.get("/", auth(), OwnershipRequestControllers.getOwnershipRequests);

router.patch(
  "/:id/status",
  auth("manager"),
  checkValidation(ownershipRequestValidationSchemas.updateOwnershipRequestStatusSchema),
  OwnershipRequestControllers.updateOwnershipRequestStatus,
);

export const OwnershipRequestRoutes = router;

