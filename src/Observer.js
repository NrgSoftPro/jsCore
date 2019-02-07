const CoreObject = require('./Object')

module.exports = class extends CoreObject {

  static makeEventHandlerName (eventName) {
    return 'on' + eventName.charAt(0).toLocaleUpperCase() + eventName.slice(1)
  }

  static makeEventName (handlerName) {
    return handlerName.charAt(2).toLocaleLowerCase() + handlerName.slice(3)
  }

  static isEventHandlerName (name) {
    return name.length > 2 && name.substr(0, 2) === 'on' &&
      name.charAt(2) === name.charAt(2).toUpperCase()
  }

  get observeFor () {
    return this.owner
  }

  initialize () {
    this.observeFor.on(this)
  }
}
