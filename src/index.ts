import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("Jwt key must be defined.");
  }
  try {
    await natsWrapper.connect("ticketing", "asdfjkl", "http://nats-srv:4222");

    natsWrapper.client.on("close", () => {
      console.log("Nats connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect("mongodb://orders-mongo-srv:27017/tickets");
    console.log("Connected to mongodb");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Listening to port 3000!!!!");
  });
};

start();
