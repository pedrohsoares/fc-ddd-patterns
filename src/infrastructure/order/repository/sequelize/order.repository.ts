import Order from "../../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import { Transaction } from "sequelize";
import { OrderMapper } from "./order.mapper";
export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {
    const transaction = await OrderModel.sequelize.transaction();

    try {
      await this.recreateOrderItems(entity, transaction);

      await OrderModel.update(
        {
          total: entity.total(),
        },
        {
          transaction: transaction,
          where: { id: entity.id },
        }
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findByPk(id, {
      include: [{ model: OrderItemModel }],
    });

    if (!orderModel) {
      throw new Error("Order not found");
    }

    return OrderMapper.toDomain(orderModel);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    return orderModels.map((orderModel: OrderModel) =>
      OrderMapper.toDomain(orderModel)
    );
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  private async recreateOrderItems(
    order: Order,
    transaction?: Transaction
  ): Promise<void> {
    await OrderItemModel.destroy({
      where: { order_id: order.id },
      transaction,
    });

    const items = order.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      product_id: item.productId,
      quantity: item.quantity,
      order_id: order.id,
    }));

    await OrderItemModel.bulkCreate(items, { transaction });
  }
}
