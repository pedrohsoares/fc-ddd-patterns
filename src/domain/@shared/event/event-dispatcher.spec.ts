import CustomerAddressUpdatedEvent from "../../customer/event/customer-address-updated.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import CustomerAddressUpdatedEventHandler from "../../customer/event/handler/customer-address-update-event.handler";
import SendConsoleLog1Handler from "../../customer/event/handler/send-console-log-1.handler";
import SendConsoleLog2Handler from "../../customer/event/handler/send-console-log-2.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
  it("Should notify user created event", () => {
    const eventDispatcher = new EventDispatcher();
    const firstEventHandler = new SendConsoleLog1Handler();
    const secondEventHandler = new SendConsoleLog2Handler();
    const firstSpyEventHandler = jest.spyOn(firstEventHandler, "handle");
    const secondSpyEventHandler = jest.spyOn(secondEventHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toMatchObject([firstEventHandler, secondEventHandler]);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "1",
      name: "Customer 1",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(firstSpyEventHandler).toHaveBeenCalled();
    expect(secondSpyEventHandler).toHaveBeenCalled();
  });

  it("Should notify customer address updated event", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new CustomerAddressUpdatedEventHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressUpdatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressUpdatedEvent"][0]
    ).toMatchObject(eventHandler);

    const customerAddressUpdatedEvent = new CustomerAddressUpdatedEvent({
      id: "1",
      name: "Customer 1",
      address: new Address("Rua 1", 123, "57000-000", "Cidade 1"),
    });

    eventDispatcher.notify(customerAddressUpdatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
