import {
  addPromo,
  getPromos,
  editPromo,
  deactivatePromo,
  updatePromo,
  findPromoByCode,
} from "../controllers/promo.controller.js";
import { Router } from "express";

export const promoRouter = Router();
promoRouter.post( "/promo", addPromo );
promoRouter.get( "/promos", getPromos );
promoRouter.get( "/promo/", findPromoByCode );
promoRouter.put( "/promo/:id", editPromo );
promoRouter.put( "/promo/:id", updatePromo );
promoRouter.delete( "/promo/:id", deactivatePromo );