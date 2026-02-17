import { queryBuilder } from "../../builder/queryBuilder";
import AppError from "../../errors/AppError";
import { IQuery } from "../../interfaces";
import { SalesModel } from "../sales/sales.model";
import { IEyeGlass } from "./eyeGlass.interface";
import { EyeGlassModel } from "./eyeGlass.model";
import { ActivityLogServices } from "../activityLog/activityLog.services";

const createEyeGlass = async (userData: any, payload: IEyeGlass) => {
  payload.createdBy = userData._id;
  const eyeGlass = await EyeGlassModel.create(payload);

  await ActivityLogServices.createActivityLog(
    { _id: userData._id, username: userData.username, role: userData.role },
    "CREATE",
    `EyeGlass ${eyeGlass._id.toString()} created by ${userData.username}`,
  );

  return eyeGlass;
};

const deleteEyeGlassByIds = async (userData: any, eyeGlassIds: string[]) => {
  const eyeGlasses = [];

  for (const eyeGlassId of eyeGlassIds) {
    if (userData.role !== "manager") {
      const eyeGlass = await EyeGlassModel.findOneAndDelete({
        _id: eyeGlassId,
        createdBy: userData._id,
      });

      if (!eyeGlass) {
        throw new AppError(400, "Eye Glass not found or you do not have permission to delete it.");
      }

      if (eyeGlass) {
        eyeGlasses.push(eyeGlass);
        await SalesModel.deleteMany({ eyeGlassId: eyeGlass._id });

        await ActivityLogServices.createActivityLog(
          { _id: userData._id, username: userData.username, role: userData.role },
          "DELETE",
          `EyeGlass ${eyeGlass._id.toString()} deleted by ${userData.username}`,
        );
      }
    } else {
      const eyeGlass = await EyeGlassModel.findByIdAndDelete(eyeGlassId);
      if (eyeGlass) {
        eyeGlasses.push(eyeGlass);
        await SalesModel.deleteMany({ eyeGlassId: eyeGlass._id });

        await ActivityLogServices.createActivityLog(
          { _id: userData._id, username: userData.username, role: userData.role },
          "DELETE",
          `EyeGlass ${eyeGlass._id.toString()} deleted by ${userData.username}`,
        );
      }
    }
  }

  return eyeGlasses;
};

const updateEyeGlassById = async (eyeGlassId: string, userData: any, payload: Partial<IEyeGlass>) => {
  let eyeGlass;
  if (userData.role === "user") {
    eyeGlass = await EyeGlassModel.findOneAndUpdate({ _id: eyeGlassId, createdBy: userData._id }, payload, {
      new: true,
    });
  } else {
    eyeGlass = await EyeGlassModel.findByIdAndUpdate(eyeGlassId, payload, { new: true });
  }

  if (!eyeGlass) {
    throw new AppError(400, "Eye Glass not found or you do not have permission to update it.");
  }

  await ActivityLogServices.createActivityLog(
    { _id: userData._id, username: userData.username, role: userData.role },
    "UPDATE",
    `EyeGlass ${eyeGlass._id.toString()} updated by ${userData.username}`,
  );

  return eyeGlass;
};

const getAllEyeGlasses = async (_userData: any, queryParams: IQuery) => {
  const { eyeGlasses, total } = await queryBuilder(queryParams, EyeGlassModel);

  return { eyeGlasses, total };
};

const reassignEyeGlassOwner = async (eyeGlassId: string, managerData: any, newOwnerId: string) => {
  if (managerData.role !== "manager") {
    throw new AppError(403, "Only managers can reassign ownership");
  }

  const eyeGlass = await EyeGlassModel.findById(eyeGlassId);

  if (!eyeGlass) {
    throw new AppError(404, "Eye Glass not found");
  }

  eyeGlass.createdBy = newOwnerId as any;
  await eyeGlass.save();

  await ActivityLogServices.createActivityLog(
    { _id: managerData._id, username: managerData.username, role: managerData.role },
    "UPDATE",
    `Ownership of eye glass ${eyeGlass._id.toString()} reassigned to user ${newOwnerId.toString()}`,
  );

  return eyeGlass;
};

const getEyeGlassById = async (eyeGlassId: string) => {
  const eyeGlass = await EyeGlassModel.findById(eyeGlassId).populate({
    path: "createdBy",
    select: "-createdAt -updatedAt",
  });

  return eyeGlass;
};

export const EyeGlassServices = {
  createEyeGlass,
  deleteEyeGlassByIds,
  updateEyeGlassById,
  getAllEyeGlasses,
  getEyeGlassById,
  reassignEyeGlassOwner,
};
