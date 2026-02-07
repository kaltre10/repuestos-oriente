import express from "express";
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js";
import responser from "../controllers/responser.js";
import validateToken from "../midelwares/validateToken.js";
import onlyAdmin from "../midelwares/onlyAdmin.js";
const router = express.Router();

router.get("/", (_req, res) => {
  responser.success({ res, message: "Brand API is working" });
});
router.get("/brands", getBrands);
router.get("/brands/:id", getBrand);

router.post("/brands", [validateToken, onlyAdmin], createBrand);
router.put("/brands/:id", [validateToken, onlyAdmin], updateBrand);
router.delete("/brands/:id", [validateToken, onlyAdmin], deleteBrand);

export default router;
