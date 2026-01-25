import { Types } from "mongoose";
import { TBrand, TFrameMaterial, TFrameShape, TLensMaterial, TLensType, TTempleType } from "./eyeGlass.constant";

export interface IEyeGlass {
  photo: string;
  name: string;
  price: number;
  quantity: number;
  frameMaterial: TFrameMaterial;
  frameShape: TFrameShape;
  lensType: TLensType;
  templeType: TTempleType;
  templeLength: number;
  bridgeWidth: number;
  lensWidth: number;
  lensHeight: number;
  lensMaterial: TLensMaterial;
  brand: TBrand;
  gender: "male" | "female";
  color: string;
  createdBy: Types.ObjectId;
}
