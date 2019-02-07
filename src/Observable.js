const Observer = require('./Observer')

const observers = Symbol()

module.exports = class {

  get observers () {
    return this[observers]
  }

  constructor (...observerList) {
    this[observers] = new Set()
    this.addObservers(...observerList)
  }

  addObservers (...observers) {
    for (const observer of observers) {
      this.addObserver(observer)
    }

    return this
  }

  addObserver (observer, callback) {
    if (callback) {
      const onEvent = Observer.makeEventHandlerName(observer)
      observer = {}
      observer[onEvent] = callback
    }
    this.observers.add(observer)

    return this
  }

  //todo: implement for callback-observers: removeObserver(observer, callback): forEach(observer => {if (observer['eventName'] === callback)})
  removeObserver (observer) {
    this.observers.delete(observer)

    return this
  }

  notifyObservers (eventName, event, ...args) {
    const onEvent = Observer.makeEventHandlerName(eventName)

    try {
      for (const observer of this.observers) {
        if (observer[onEvent]) {
          let result = observer[onEvent](event, ...args)

          if (undefined !== result) {
            event = result
          }
        }
      }

      const onCompleteEvent = onEvent + 'Complete'
      for (const observer of this.observers) {
        if (observer[onCompleteEvent]) {
          observer[onCompleteEvent](event, ...args)
        }
      }

    } catch (error) {
      console.error(error)

      if (error) {
        for (const observer of this.observers) {
          if (observer['onError']) {
            observer['onError'](error, event, ...args)
          }
        }
      }
    }
  }
}
