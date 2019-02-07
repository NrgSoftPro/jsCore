const className = Symbol()
const properties = Symbol()
const services = Symbol()
const instance = Symbol()

const self = class {

  get hasInstance () {
    return !!this[instance]
  }

  get className () {
    return this[className]
  }

  constructor (definition, props, servs) {
    this[className] = definition[0] || definition
    this[properties] = definition[1] || {}
    this[services] = definition[2] || {}

    this[properties] = {...this[properties], ...props || {}}
    this[services] = {...this[services], ...servs || {}}
  }

  getInstance (injector) {
    if (!this.hasInstance) {
      this[instance] = injector ?
        injector.createObject(...this) :
        new this[className](this[properties], this[services])
    }

    return this[instance]
  }

  isEqual (definition) {
    if (definition instanceof self) {
      return this[className] === definition.className
    }

    return definition instanceof this[className] || definition === this[className]
  }

  [Symbol.iterator] () {
    return [this[className], this[properties], this[services]][Symbol.iterator]()
  }
}

module.exports = self