import { Types } from "mongoose";

export interface ISales {
  productId: Types.ObjectId;
  quantity: number;
  buyerName: string;
  saleDate: string;
  sellerId: Types.ObjectId;
}
