import { Router } from "express";

import {
  getAllProductsStatic as getAllProductsStaticController,
  getAllProducts as getAllProductsController,
} from "../controllers/products";

// Use aliases to avoid conflicts

const router = Router();

const {
  getAllProductsStatic,
  getAllProducts,
} = require(`../controllers/products`);

router.route(`/`).get(getAllProducts);
router.route(`/static`).get(getAllProductsStatic);

export default router;
