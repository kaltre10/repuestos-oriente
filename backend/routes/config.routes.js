import express from "express";
import {
  getConfigs,
  getConfig,
  createConfig,
  updateConfig,
  deleteConfig,
  updateDolarFromBCV,
} from "../controllers/config.controller.js";
import responser from "../controllers/responser.js";
import validateToken from "../midelwares/validateToken.js";
import onlyAdmin from "../midelwares/onlyAdmin.js";

const router = express.Router();

router.get("/", (_req, res) => {
  responser.success({ res, message: "Config API is working" });
});
router.get("/configs", getConfigs);
router.get("/configs/:id", getConfig);
router.post("/update-dolar-bcv", updateDolarFromBCV);

router.post("/configs", [validateToken, onlyAdmin], createConfig);
router.put("/configs/:id", [validateToken, onlyAdmin], updateConfig);
router.delete("/configs/:id", [validateToken, onlyAdmin], deleteConfig);

export default router;
