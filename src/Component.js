const CoreObject = require('./Object')
const Property = require('./Property')
const Observable = require('./Observable')
const Observer = require('./Observer')
const Event = require('./Event')

const observable = Symbol()

module.exports = class extends CoreObject {

  _constructor (...args) {
    this[observable] = new Observable()
    this.on(this)
    super._constructor(...args)
    this.mapEvents(this.events || {})
  }

  on (...args) {
    this[observable].addObserver(...args)

    return this
  }

  off (...args) {
    this[observable].removeObserver(...args)

    return this
  }

  trigger (eventName, event, context = this, ...args) {
    this[observable].notifyObservers(eventName, event, context, ...args)
  }

  mapEvents (events) {
    for (const [toEventName, properties] of Object.entries(events)) {
      for (const [property, fromEventName] of Object.entries(properties)) {
        const component = Property.parse(property, this).value

        this.mapEvent(component, fromEventName, toEventName)
      }
    }

    return this
  }

  mapEvent (component, fromEventName, toEventName) {
    Event.map(this, component, fromEventName, toEventName)

    return this
  }

  set (property, value) {
    return Observer.isEventHandlerName(property) ?
      this.on(Observer.makeEventName(property), value) :
      super.set(property, value)
  }
}
