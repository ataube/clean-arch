const log = require('../../log')('application:eventPublisher');
const domain = require('../../domain');

const eventTypes = Object.keys(domain.events.types);

/**
 * Integration component to publish events to a system wide event bus like NATS, Kafka, RabbitMQ
 * @param {*} client - the client
 * @param {*} eventStore - the event store
 * @param {*} eventBus - the domain event bus
 */
function eventPublisher(client, eventStore, eventBus) {
  async function publish(type, event) {
    try {
      log.info('Publish event type: %s with id: %s', type, event.id);
      await client.publishEvent(event);
      log.info('Mark event as published');
      await eventStore.markEventAsPublished(event.id);
    } catch (e) {
      log.error('Error publishing event', e);
    }
  }

  function listen() {
    eventTypes.forEach(key => {
      eventBus.on(key, event => publish(key, event));
    });
  }

  return {
    listen
  };
}
module.exports = eventPublisher;
