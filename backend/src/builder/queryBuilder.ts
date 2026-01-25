import { FilterQuery } from "mongoose";

export async function queryBuilder(queryParams: any, Model: any): Promise<any> {
  const query: FilterQuery<any> = {};

  const { page = 1, limit = 10, sortBy, sortOrder } = queryParams;
  const skip = (page - 1) * limit;

  // sorting
  const sortCriteria: any = {};
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

  const data = await Model.find(query).sort(sortCriteria).skip(skip).limit(limit);
  const count = await Model.countDocuments(query);
  return { eyeGlasses: data, total: count };
}
