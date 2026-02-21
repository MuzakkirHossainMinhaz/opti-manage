"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryBuilder = queryBuilder;
function queryBuilder(queryParams, Model) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {};
        const { page = 1, limit = 10, sortBy, sortOrder } = queryParams;
        const skip = (page - 1) * limit;
        // sorting
        const sortCriteria = {};
        if (sortBy) {
            sortCriteria[sortBy] = sortOrder === "desc" ? -1 : 1;
        }
        // price range
        if (queryParams.price) {
            query.price = {};
            query.price.$gte = Number(queryParams.price[0]);
            query.price.$lte = Number(queryParams.price[1]);
        }
        // temple length range
        if (queryParams.templeLength) {
            query.templeLength = {};
            query.templeLength.$gte = Number(queryParams.templeLength[0]);
            query.templeLength.$lte = Number(queryParams.templeLength[1]);
        }
        // bridge width range
        if (queryParams.bridgeWidth) {
            query.bridgeWidth = {};
            query.bridgeWidth.$gte = Number(queryParams.bridgeWidth[0]);
            query.bridgeWidth.$lte = Number(queryParams.bridgeWidth[1]);
        }
        // other filters
        const filterParams = ["frameMaterial", "frameShape", "lensType", "brand", "gender", "color"];
        filterParams.forEach((param) => {
            if (queryParams[param]) {
                query[param] = queryParams[param];
            }
        });
        if (queryParams.createdBy) {
            query.createdBy = queryParams.createdBy;
        }
        const data = yield Model.find(query).sort(sortCriteria).skip(skip).limit(limit);
        const count = yield Model.countDocuments(query);
        return { eyeGlasses: data, total: count };
    });
}
