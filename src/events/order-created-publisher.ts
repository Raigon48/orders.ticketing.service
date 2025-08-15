import { OrderCreatedEvent, Publisher, Subjects } from "@raipackages/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
