const Definition = require('./Definition')
const Property = require('./Property')

const definitions = Symbol()

const self = class {

  static use (owner, definition) {
    if (!owner[definitions]) {
      owner[definitions] = new Set()
    }

    if (this.hasTrait(definition)) {
      throw new Error('Object already uses this trait.')
    }

    owner[definitions].add(definition)

    const trait = new Definition(definition, {}, {owner}).getInstance(owner.injector)
    const assignments = trait.assignments || {}

    if (Array.isArray(assignments)) {
      assignments.forEach(name => Property.map(owner, name, name, trait))
    } else {
      for (let [name, strings] of Object.entries(assignments)) {
        Property.map(owner, name, strings, trait)
      }
    }
  }

  static hasTrait (owner, traitDefinition) {
    if (!owner[definitions]) {
      return false
    }

    for (const definition of owner[definitions]) {
      if (definition.isEqual(traitDefinition)) {
        return true
      }
    }

    return false
  }
}

module.exports = self