import { promoModel } from "../database/models/promotion.model.js";
import mongoose from "mongoose";
/**
 * @Author : Ahmed Mohamed Salah
 * @param {*} req
 * @param {*} res
 * @returns add new promo { message: "Promo added successfully", promo }
 */
export async function addPromo(req, res) {
  // check if the user admin
  //   if (req.user.role !== "admin")
  //     return res
  //       .status(401)
  //       .json({ message: "You are not authorized to perform this action " });
  try {
    /* security layer to validate the data */
    // filter body to check if all required fields are present
    const { code, discount, validFrom, validTo } = req.body;
    // code must be unique
    const Foundedpromo = await promoModel.findOne({ code });
    if (Foundedpromo)
      return res.status(400).json({ message: "Promo code already exists" });
    if (!code || !discount || !validFrom || !validTo)
      return res.status(400).json({ message: "Please fill all the fields" });
    const promo = new promoModel(req.body);
    await promo.save();
    res.status(201).json({ message: "Promo added successfully", promo });
  } catch (error) {
    res.status(400).json({ message: " Error adding promo", error });
  }
}
/**
 * @Author AhmedMohammedSalah
 * @param {*} req
 * @param {*} res
 * @returns all promotions as json { message: "success get all promos", promos }
 */
export async function getPromos(req, res) {
  // check Authority <admin only>

  // if ( req.user.role !== 'admin' )
  //     return res.status( 401 ).json( { message: 'Unauthorized' } );
  // get all promos
  const promos = await promoModel.find();
  // return promos
  res.status(200).json({ message: "success get all promos", promos });
}
/**
 * @Author AhmedMohammedSalah
 * @param {*} req
 * @param {*} res
 * @returns promo by id as json{ message: "Promo updated successfully", updatedPromo }
 */
export async function editPromo(req, res) {
  // check Authority <admin only>
  // if ( req.user.role !== 'admin' )
  //     return res.status( 401 ).json( { message: 'Unauthorized' } );

  // get promo id
  const id = req.params.id;
  // check if promo id is oid
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: "Invalid promo id" });
  // get promo
  const promo = await promoModel.findById(id);
  // check if promo exists
  if (!promo) return res.status(404).json({ message: "Promo not found" });
  // update promo
  const updatedPromo = await promoModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // return updated promo
  res.status(200).json({ message: "Promo updated successfully", updatedPromo });
}
/**
 * @Author AhmedMohammedSalah
 * @param {*} req
 * @param {*} res
 * @logic is to make valid to date.now <means expires>
 * @returns promo deactivated as json{ message: "Promo deactivated successfully", deactivatedPromo }
 */
export async function deactivatePromo(req, res) {
  // check Authority <admin only>
  // if ( req.user.role !== 'admin' )
  //     return res.status( 401 ).json( { message: 'Unauthorized' } );
  // get promo id
  const id = req.params.id;
  // check if promo id is oid
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: "Invalid promo id" });
  // get promo
  const promo = await promoModel.findById(id);
  // check if promo exists
  if (!promo) return res.status(404).json({ message: "Promo not found" });
  // deactivate promo
  let now = Date.now();
  const deactivatedPromo = await promoModel.findByIdAndUpdate(
    id,
    { validTo: now },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "Promo deactivated successfully", deactivatedPromo });
}
/**
 * @Author AhmedMohammedSalah
 * @param {*} req
 * @param {*} res
 * @returns promo updated as json{ message: "Promo updated successfully", updated }
 */
export async function updatePromo(req, res) {
  // check Authority <admin only>
  // if ( req.user.role !== 'admin' )
  //     return res.status( 401 ).json( { message: 'Unauthorized' } );
  // get promo id
  const id = req.params.id;
  // check if promo id is oid
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: "Invalid promo id" });
  // get promo
  const promo = await promoModel.findById(id);
  // check if promo exists
  if (!promo) return res.status(404).json({ message: "Promo not found" });
  // update promo
  try {
    const updatedPromo = await promoModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Promo updated successfully", updated });
  } catch (error) {
    return res.status(400).json({ message: "Error updating promo", error });
  }
}
/**
 * @Author AhmedMohammedSalah
 * @param {*} req
 * @param {*} res
 * @description act as helper function to apply promo on user orders
 * @returns promo by code if exsist as json { message: "Promo found", promo }
 */
export async function findPromoByCode(req, res) {
  const code = req.body.code;
  const promo = await promoModel.findOne({ code });
  if (!promo) return res.status(404).json({ message: "Promo not found" });
  // check if promo is active
  if (promo.validTo < Date.now())
    return res.status(400).json({ message: "Promo Expired" });
  return res.status(200).json({ message: "Promo found", promo });
}
