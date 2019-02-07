const map = Symbol()

const self = class {

  static map (object, name, properties, context) {
    context = context || object

    if (!object[map]) {
      object[map] = new Map()
    }

    const isDefined = object[map].has(name)

    if (!isDefined) {
      object[map].set(name, new Set())
    }

    const strings = self.stringify(properties)
    const set = object[map].get(name)

    for (const string of strings) {
      set.add(self.parse(string, context))
    }

    if (isDefined) {
      return
    }

    const first = self.parse(strings[0], context)

    if (typeof first.value === 'function') {
      object[name] = (...args) => {
        let result
        for (const prop of set) {
          result = prop.value.call(prop.context, ...args)
        }

        return result
      }
    } else {
      Object.defineProperty(object, name, {
        get: () => {
          return first.context[first.name]
        },
        set: value => {
          for (const prop of set) {
            prop.context[prop.name] = value
          }
        }
      })
    }
  }

  static stringify (properties) {
    let strings = properties

    if (typeof properties === 'string') {
      strings = [properties]
    } else if (typeof properties === 'object') {
      strings = []
      for (const [component, prop] of Object.entries(properties)) {
        strings.push(`${component}.${prop}`)
      }
    }

    return strings
  }

  static parse (string, object) {
    const arr = string.split('.')

    let
      context = object,
      name = arr[0],
      value = context[name]

    for (let i = 1; i < arr.length; i++) {
      context = value
      name = arr[i]
      value = context[name]
    }

    return {context, name, value}
  }
}

module.exports = self