import { Request, Response } from "express";
import product from `../models/product`
const getAllProductsStatic = async (req:Request, res:Response): Promise<void> => {
  const products = await product.find({}).sort(`-name`);
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req:Request, res:Response): Promise <void> => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject:any = {};

  if (featured) {
    queryObject.featured = featured === `true` ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: `i` };
  }

  // console.log(queryObject);

  let result = await product.find(queryObject);
  // sort
  if (sort) {
    const sortList = (sort as string).split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort(`createdAt`);
  }
  if (fields) {
    const fieldsList = (fields as string).split(",").join(" ");
    result = result.select(fieldsList);
  }
  if (numericFilters) {
    const operatorMap: Record<string,string> = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = (numericFilters as string).replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").map((item:string) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
      return item 
    }).join(",");
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

export { getAllProductsStatic, getAllProducts };