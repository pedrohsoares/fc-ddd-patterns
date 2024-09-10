import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderModel from "./order.model";

export class OrderMapper {
  static toDomain(orderModel: OrderModel): Order {
    const orderItems = orderModel.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      );
    });

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }
}
