import orderModel from "../database/models/order.model.js";
import { paymentModel } from "../database/models/payment.model.js";
import sellerModel from "../database/models/seller.model.js";
import { collectSellersAndTheirProducts } from "./order.controller.js";
import paypal from "@paypal/checkout-server-sdk";

export async function getAllPayments(req, res) {
  if (req.user.role !== "admin") {
    return res
      .status(401)
      .send({ message: "You are not authorized to read all payments" });
  }
  try {
    const payments = await paymentModel.find();
    res.status(200).json({
      message: "All Payments",
      payments,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res
      .status(500)
      .send({ message: "Error getting payment", error: error.message });
  }
}
export async function getPayment(req, res) {
  if (req.user.role !== "admin") {
    return res
      .status(401)
      .send({ message: "You are not authorized to read all payments" });
  }
  const paymentId = req.params.id;
  if (!paymentId) res.status(400).send({ message: "payment id is required" });
  try {
    const payment = await paymentModel.findById(paymentId);
    if (!payment) res.status(400).send({ message: "payment not found" });
    res.status(200).send({ message: "Payment featched successfully", payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res
      .status(500)
      .send({ message: "Error getting payment", error: error.message });
  }
}

export async function createPayment(req, res) {
  try {
    const { orderId } = req.body;
    const customerId = req.user._id;

    // Authorization check
    if (req.user.role !== "user") {
      return res
        .status(401)
        .send({ message: "You are not authorized to create payment" });
    }

    // Validate required fields
    if (!orderId) {
      return res
        .status(400)
        .send({ message: "Order ID and Payment Gateway ID are required" });
    }

    // Fetch the order
    const order = await orderModel.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    // Calculate the total amount from the order
    const amount = order.total;

    // Collect sellers and their products
    const sellersProducts = await collectSellersAndTheirProducts(order.items);

    // Create the payment record
    const payment = new paymentModel({
      orderId,
      amount,
      customerId,
      paymentStatus: "success", // Assuming payment is successful for this example
    });
    await payment.save();

    // Update the order with payment ID and status
    order.paymentId = payment._id;
    order.status = "Pending";
    await order.save();

    // Distribute payments to sellers
    for (const sellerId in sellersProducts) {
      if (sellersProducts.hasOwnProperty(sellerId)) {
        const seller = await sellerModel.findOne({ userId: sellerId });
        if (!seller) {
          console.warn(`Seller not found for ID: ${sellerId}`);
          continue; // Skip if seller is not found
        }

        // Calculate total earnings for the seller
        let totalMoney = sellersProducts[sellerId].reduce(
          (sum, product) => sum + product.quantity * product.price,
          0
        );

        // Deduct 10% as platform fee and update seller's balance
        seller.balance += totalMoney - totalMoney / 10;

        await seller.save();
      }
    }

    // Send success response
    res
      .status(201)
      .send({ message: "Payment created successfully", payment, order });
  } catch (error) {
    console.error("Error creating payment:", error);
    res
      .status(500)
      .send({ message: "Error creating payment", error: error.message });
  }
}
const configureEnvironment = () => {
  const clientId =
    "AbLRWLm3NZT8Ine3miqGN5QaiEmvh4ZkthhI3I1-vsXS2M8xc59M361uPy83F_U5GOxhMuBstTUgwL38";
  const clientSecret =
    "EBRPDw43t5bkzqhb4TDqt5RqIX4rOy9QDwqLboj10IRGcbqCalitKICs6UnP4uab23S7ZGV8ezGYeWK2";
  return process.env.NODE_ENV === "production"
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
};

const client = new paypal.core.PayPalHttpClient(configureEnvironment());

export async function executePaypal(req, res) {
  try {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({
    // intent: "CAPTURE",
    // purchase_units: [
    //   {
    //     amount: {
    //       currency_code: "USD",
    //       value: "10.00",
    //     },
    //   },
    // ],
  });

    // Execute the capture request
    const captureResponse = await client.execute(request);

    // Optionally update your Payment record in your database.
    // Example: Find the Payment record by orderID (or similar field) and update its status.
    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentGatewayId: orderID },
      {
        paymentStatus: "success",
        paymentGatewayId: captureResponse.result.id,
        orderId: captureResponse.result.purchase_units[0].reference_id,
      },
      { new: true }
    );

    res.json({
      success: true,
      orderId: updatedPayment.orderId,
      paymentId: updatedPayment.paymentGatewayId,
    });
  } catch (error) {
    console.error("PayPal execution error:", error);
    res.status(500).json({
      success: false,
      error: "Payment processing failed",
    });
  }
}
