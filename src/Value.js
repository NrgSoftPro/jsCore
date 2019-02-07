const Property = require('./Property')

module.exports = class {

  constructor (properties = {}, services = {}) {
    this.set(services)
    this._constructor(properties)
  }

  _constructor (properties) {
    this
      .mapProperties(this.properties || {})
      .set({...this.defaults || {}, ...properties || {}})

    if (this.initialize) {
      this.initialize()
    }
  }

  set (property, value) {
    if (typeof property === 'object') {
      for (const [prop, value] of Object.entries(property)) {
        this.set(prop, value)
      }
    } else {
      this[property] = value
    }

    return this
  }

  mapProperty (name, properties, context = this) {
    Property.map(this, name, properties, context)

    return this
  }

  mapProperties (properties, context = this) {
    for (let [name, strings] of Object.entries(properties)) {
      this.mapProperty(name, strings, context)
    }

    return this
  }
}
