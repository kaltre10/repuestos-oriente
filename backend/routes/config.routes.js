import express from "express";
import {
  getConfigs,
  getConfig,
  createConfig,
  updateConfig,
  deleteConfig,
} from "../controllers/config.controller.js";
import responser from "../controllers/responser.js";
import validateToken from "../midelwares/validateToken.js";

const router = express.Router();

router.get("/", (_req, res) => {
  responser.success({ res, message: "Config API is working" });
});
router.get("/configs", getConfigs);
router.get("/configs/:id", getConfig);

router.post("/configs", validateToken, createConfig);
router.put("/configs/:id", validateToken, updateConfig);
router.delete("/configs/:id", validateToken, deleteConfig);

export default router;
