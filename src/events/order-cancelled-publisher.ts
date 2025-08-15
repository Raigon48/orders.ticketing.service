import { OrderCancelledEvent, Publisher, Subjects } from "@raipackages/common";

export class OrderCreatedPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
