import { searchContacts } from "../controllers/ContactsControllers.js";
import {Router} from "express";
import {verifyToken} from "../middlewares/AuthMiddleware.js"

const contactsRoutes= Router();

contactsRoutes.post("/search",verifyToken,searchContacts)

export default contactsRoutes;