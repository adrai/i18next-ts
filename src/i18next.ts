type OnExtendOptionsHandler = (options: object) => object | Promise<object>

class I18next {
  private isInitialized = false
  private onExtendOptionsHooks: Array<OnExtendOptionsHandler> = []

  constructor(public options = {}){}

  onExtendOptions(handle: OnExtendOptionsHandler) : I18next {
    this.onExtendOptionsHooks.push(handle)
    return this
  }

  async init() {
    const allOptions = await Promise.all(this.onExtendOptionsHooks.map((handle) => {
      const ret = handle({ ...this.options })
      const retPromise = ret as Promise<object>
      if (retPromise) {
        return retPromise
      } else {
        return Promise.resolve(ret)
      }
    }))
    allOptions.forEach((opt) => {
      this.options = { ...opt, ...this.options }
    })
    this.isInitialized = true
    return this
  }

  t(key: string, options?: object) : string {
    if (!this.isInitialized) throw new Error('i18next is not yet initialized!')
    return `whould have translated ${key}`
  }
}

export default function (options?: object) {
  return new I18next(options)
}
