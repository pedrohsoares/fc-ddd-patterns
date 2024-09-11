import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressUpdatedEvent from "../customer-address-updated.event";

export default class CustomerAddressUpdatedEventHandler
  implements EventHandlerInterface<CustomerAddressUpdatedEvent>
{
  handle(event: CustomerAddressUpdatedEvent): void {
    const customerData = event.eventData;
    console.log(
      "Endereço do cliente: %s, %s alterado para: %s",
      customerData.id,
      customerData.name,
      customerData.address.toString()
    );
  }
}
