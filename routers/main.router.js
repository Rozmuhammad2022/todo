import { Router } from "express";

import mainController from "../controllers/main.controller.js";
import validator from "../helper/validation/input.validation.js";

let router = new Router();

router.get("/", mainController.signInPage);
router.get("/signup", mainController.signUpPage);
router.get("/list", mainController.isAuth, mainController.listPage);
router.get("/logout", mainController.isAuth, mainController.logout);
router.get("/add", mainController.isAuth, mainController.addPage);
router.get("/drug/:id", mainController.isAuth, mainController.drugPage);
router.get("/delete/drug/:id", mainController.isAuth, mainController.deleteDrug);
router.get('/edit/drug/:id', mainController.isAuth, mainController.editPage);

router.post('/edit/drug/:id', mainController.edit);
router.post("/signup", validator.signup, mainController.signUp);
router.post("/signin", validator.signin, mainController.signIn);
router.post("/add", mainController.isAuth, validator.add, mainController.add);
router.post("/changeCount", mainController.isAuth, mainController.editCount);
router.post("/search", mainController.isAuth, mainController.search);

export default router;