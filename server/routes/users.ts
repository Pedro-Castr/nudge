import { Router } from "express";
import usersController from "../controllers/users";

const router = Router();

router.post("/", usersController.create);
router.get("/:email", usersController.findOneByEmail);

export default router;
