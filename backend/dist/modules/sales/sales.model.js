"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const salesSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Product ID is required"],
        ref: "EyeGlass",
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
    },
    buyerName: {
        type: String,
        required: [true, "Name of the buyer is required"],
    },
    saleDate: {
        type: String,
        required: [true, "Date of the sale is required"],
    },
    sellerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, "Seller ID is required"],
        ref: "User",
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.SalesModel = mongoose_1.default.model("Sales", salesSchema);
