import { Router } from "express";
import { getAllProductsStatic, getAllProducts } from "../controllers/products";

const router = Router();

const {
  getAllProductsStatic,
  getAllProducts,
} = require(`../controllers/products`);

router.route(`/`).get(getAllProducts);
router.route(`/static`).get(getAllProductsStatic);

export default router;
