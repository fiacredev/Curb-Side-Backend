import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { loginDriver, loginCustomer } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup/driver", AuthController.signupDriver);
router.post("/signup/customer", AuthController.signupCustomer);
router.post("/signin/driver", loginDriver);
router.post("/signin/customer", loginCustomer);

export default router;