import { queryBuilder } from "../../builder/queryBuilder";
import AppError from "../../errors/AppError";
import { IQuery } from "../../interfaces";
import { SalesModel } from "../sales/sales.model";
import { IEyeGlass } from "./eyeGlass.interface";
import { EyeGlassModel } from "./eyeGlass.model";

const createEyeGlass = async (userData: any, payload: IEyeGlass) => {
  payload.createdBy = userData._id;
  const eyeGlass = await EyeGlassModel.create(payload);
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
      }
    } else {
      const eyeGlass = await EyeGlassModel.findByIdAndDelete(eyeGlassId);
      if (eyeGlass) {
        eyeGlasses.push(eyeGlass);
        await SalesModel.deleteMany({ eyeGlassId: eyeGlass._id });
      }
    }
  }

  return eyeGlasses;
};

const deleteAllEyeGlasses = async (userData: any) => {
  const eyeGlasses = await EyeGlassModel.deleteMany({
    createdBy: userData._id,
  });

  const sales = await SalesModel.deleteMany({
    sellerId: userData._id,
  });

  return [eyeGlasses, sales];
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

  return eyeGlass;
};

const getAllEyeGlasses = async (userData: any, queryParams: IQuery) => {
  if (userData.role === "user") {
    queryParams.createdBy = userData._id;
  }

  const { eyeGlasses, total } = await queryBuilder(queryParams, EyeGlassModel);

  return { eyeGlasses, total };
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
  deleteAllEyeGlasses,
  updateEyeGlassById,
  getAllEyeGlasses,
  getEyeGlassById,
};
