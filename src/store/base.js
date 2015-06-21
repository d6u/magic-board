export default class BaseStore {

  constructor() {
    this.eventHandlers = new Map();
  }

  /**
   * Register event callbacks
   *
   * @param  {string}   name
   * @param  {Function} handler
   * @return {void}
   */
  register(name, handler) {
    let handlers = this.eventHandlers.get(name);

    if (!handlers) {
      handlers = new Set();
      this.eventHandlers.set(name, handlers);
    }

    handlers.add(handler);
  }

  deregister(name, handler) {
    let handlers = this.eventHandlers.get(name);

    if (handlers) {
      handlers.delete(handler);
    }
  }

  trigger(name, data) {
    let handlers = this.eventHandlers.get(name);

    if (handlers) {
      for (let h of handlers) {
        h(data);
      }
    }
  }

}
