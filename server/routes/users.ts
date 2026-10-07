import { Router } from "express";
import usersController from "../controllers/users";

const router = Router();

router.post("/", usersController.create);
router.patch("/:id", usersController.update);
router.delete("/:id", usersController.remove);
router.get("/:id", usersController.findOneById);

export default router;
