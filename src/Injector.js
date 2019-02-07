const Definition = require('./Definition')

module.exports = class {

  constructor () {
    this.definitions = new Map()
    this.nonameInstances = new Set()

    this.setService('injector', this)
  }

  createObject (className, properties = {}, services = {}) {
    services.injector = this

    for (const [alias, definition] of Object.entries(className.services || {})) {
      if (services[alias]) {
        continue
      }

      if (!this.hasService(definition)) {
        throw new Error(`Service '${alias}' was not found`)
      }

      services[alias] = this.getService(definition)
    }

    return new className(properties, services)
  }

  loadServices (definitions = {}) {
    for (const [alias, definition] of Object.entries(definitions)) {
      this.setService(alias, definition)
    }

    return this
  }

  instanceServices (...names) {
    names.forEach(name => {
      this.getService(name)
    })

    return this
  }

  hasService (name) {
    return (typeof name === 'string' && this.definitions.has(name)) ||
      typeof name === 'function' || // isClass
      (Array.isArray(name) && typeof name[0] === 'function') // isClass
  }

  setService (name, definition) {
    this.definitions.set(name, new Definition(definition))

    return this
  }

  getService (name) {
    if (typeof name === 'string') {
      return this.definitions.get(name).getInstance(this)
    }

    const needle = new Definition(name)

    for (let [key, definition] of this.definitions) {
      if (needle.isEqual(definition)) {
        return this.getService(key)
      }
    }

    for (let nonameInstance of this.nonameInstances) {
      if (needle.isEqual(nonameInstance)) {
        return nonameInstance
      }
    }

    const instance = needle.getInstance(this)
    this.nonameInstances.add(instance)

    return instance
  }
}