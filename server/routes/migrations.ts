import { Router } from "express";
import migrationsController from "../controllers/migrations";

const router = Router();

router.get("/", migrationsController.get);
router.post("/", migrationsController.post);

export default router;
