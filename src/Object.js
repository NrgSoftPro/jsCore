const Value = require('./Value')
const Trait = require('./Trait')

module.exports = class extends Value {

  _constructor (...args) {
    this.use(...this.traits || [])
    super._constructor(...args)
  }

  use (...definitions) {
    definitions.forEach(definition => Trait.use(this, definition))

    return this
  }
}
