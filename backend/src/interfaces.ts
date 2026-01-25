import { TBrand, TFrameMaterial, TFrameShape, TLensType } from "./modules/eyeGlass/eyeGlass.constant";

export interface IErrorResponse {
  statusCode: number;
  message: string;
  errorMessage: string;
  errorDetails: any;
}

export interface IQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  frameMaterial?: TFrameMaterial;
  frameShape?: TFrameShape;
  lensType?: TLensType;
  brand?: TBrand;
  gender?: "male" | "female";
  color?: string;
  price?: number[];
  templeLength?: number[];
  bridgeWidth?: number[];
  createdBy?: string;
}
