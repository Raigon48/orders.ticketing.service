import express from "express";
import { json } from "body-parser";

import { currentUser, errorHandler } from "@raipackages/common";
import { NotFoundError } from "@raipackages/common";

import cookieSession from "cookie-session";
import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

const app = express();

app.set("trust proxy", true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUser);

app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.use((req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
