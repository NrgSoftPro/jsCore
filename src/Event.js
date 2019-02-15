const self = class {

  static map (object, component, fromEventName, toEventName) {
    toEventName = toEventName || fromEventName

    if (Array.isArray(component)) {
      component.forEach(item => {
        self.map(object, item, fromEventName, toEventName)
      })
    } else if (component.on) {
      component.on(fromEventName, (event, ...contexts) => {
        object.trigger(toEventName, event, object, ...contexts)
      })
    } else {
      component.addEventListener(fromEventName, event => {
        object.trigger(toEventName, event, object, component)
      })
    }
  }
}

module.exports = self
