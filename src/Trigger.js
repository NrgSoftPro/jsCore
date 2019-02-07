const Observer = require('./Observer')

module.exports = class extends Observer {

  on (...args) {
    return this.owner.on(...args)
  }

  trigger (...args) {
    this.owner.trigger(...args)
  }

  mapEvent (...args) {
    return this.owner.mapEvent(...args)
  }
}
