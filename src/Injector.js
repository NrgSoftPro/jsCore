const Definition = require('./Definition')

module.exports = class {

  constructor () {
    this.definitions = new Map()
    this.nonameInstances = new Set()

    this.setService('injector', this)
  }

  resolve (dependencies, services = {}) {
    const instances = {injector: this, ...services}

    for (const [alias, definition] of Object.entries(dependencies)) {
      if (instances[alias]) {
        continue
      }

      if (!this.hasService(definition)) {
        throw new Error(`Service '${alias}' was not found`)
      }

      instances[alias] = this.getService(definition)
    }

    return instances
  }

  createObject (className, properties = {}, services = {}) {
    return new className(properties, this.resolve(className.services || {}, services))
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
    return (typeof name === 'string' && this.definitions.has(name)) || Definition.isSuitable(name)
  }

  setService (name, definition) {
    const value = Definition.isSuitable(definition) ? new Definition(definition) : definition
    this.definitions.set(name, value)

    return this
  }

  getService (name) {
    if (typeof name === 'string') {
      const value = this.definitions.get(name)

      return value instanceof Definition ? value.getInstance(this) : value
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