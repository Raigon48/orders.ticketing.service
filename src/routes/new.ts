import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@raipackages/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;
    // find the ticket user is trying to purchase
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return next(new NotFoundError());
    }

    // ensure that ticket is not already reserved or purchased
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      return next(new BadRequestError("Ticket is already reserved"));
    }

    // calculate the expiration time for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 300);

    // build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });
    await order.save();

    // publish an event saying that an order was created

    return res.status(201).send(order);
  }
);

export { router as newOrderRouter };
