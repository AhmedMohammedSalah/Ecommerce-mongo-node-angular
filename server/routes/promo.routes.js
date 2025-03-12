import {
  addPromo,
  getPromos,
  editPromo,
  deactivatePromo,
  findPromoByCode,
} from "../controllers/promo.controller.js";
import { Router } from "express";
import { tokenVerify } from "../middleware/tokenVerify.js";

export const promoRouter = Router();

// [AMS] 🪪 using of verify token on all routes
promoRouter.use(tokenVerify);
promoRouter.post( "/promo", addPromo );
promoRouter.get( "/promos", getPromos );
promoRouter.get( "/promo/", findPromoByCode );
promoRouter.put( "/promo/:id", editPromo );
promoRouter.delete( "/promo/:id", deactivatePromo );