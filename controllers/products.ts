import { Request, Response } from "express";
import product from "../models/product";

const getAllProductsStatic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await product.find({}).sort({ name: -1 });
    res.status(200).json({ products, nbHits: products.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    const queryObject: Partial<any> = {};

    if (featured) {
      queryObject.featured = featured === "true";
    }
    if (company) {
      queryObject.company = company;
    }
    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }

    let result = product.find(queryObject);

    // Sorting
    if (sort) {
      const sortCriteria = (sort as string).split(",").join(" ");
      result = result.sort(sortCriteria);
    } else {
      result = result.sort({ createdAt: 1 });
    }

    // Field Selection
    if (fields) {
      const fieldsList = (fields as string).split(",").join(" ");
      result = result.select(fieldsList);
    }

    // Numeric Filters
    if (numericFilters) {
      const operatorMap: Record<string, string> = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };
      const regEx = /\b(<|>|>=|=|<|<=)\b/g;
      const modifiedFilters = (numericFilters as string)
        .split(",")
        .map((item) => {
          const [field, operator, value] = item.split("-");
          if (operatorMap[operator] && ["price", "rating"].includes(field)) {
            queryObject[field] = { [operatorMap[operator]]: Number(value) };
          }
          return item;
        });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getAllProductsStatic, getAllProducts };
