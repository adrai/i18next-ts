type Resources = { [key: string]: string }
type ExtendOptionsHandler = (options: object) => object | Promise<object>
type LoadResourcesHandler = () => Resources | Promise<Resources>

const getProperty = <T, K extends keyof T>(o: T, propertyName: K): T[K] => o[propertyName]

const runHooks = async (hooks: Array<Function>, args: Array<any>) => {
  return Promise.all(hooks.map((handle) => {
    const ret = handle.call(this, args)
    const retPromise = ret as Promise<object>
    return retPromise || Promise.resolve(ret)
  }))
}

class I18next {
  private isInitialized = false
  private extendOptionsHooks: Array<ExtendOptionsHandler> = []
  private loadResourcesHooks: Array<LoadResourcesHandler> = []
  private resources: Resources = {}

  constructor(public options = {}){}

  private throwIfAlreadyStarted(msg: string) {
    if (this.isInitialized) throw new Error(msg)
  }

  private throwBecauseOfHookIfAlreadyStarted(hook: string) {
    this.throwIfAlreadyStarted(`Cannot call "addHook(${hook})" when fastify instance is already started!`)
  }

  addHook(name: 'extendOptions', hook: ExtendOptionsHandler): I18next
  addHook(name: 'loadResources', hook: LoadResourcesHandler): I18next
  addHook(name: string, hook: any): I18next {
    this.throwBecauseOfHookIfAlreadyStarted(name)
    if (name === 'extendOptions') this.extendOptionsHooks.push(hook)
    if (name === 'loadResources') this.loadResourcesHooks.push(hook)
    return this
  }

  private async runExtendOptionsHooks() {
    const allOptions = await runHooks(this.extendOptionsHooks, [{ ...this.options }])
    allOptions.forEach((opt) => {
      this.options = { ...opt, ...this.options }
    })
  }

  private async runLoadResourcesHooks() {
    let resources = {}
    const allResources = await runHooks(this.loadResourcesHooks, [])
    allResources.forEach((res) => {
      resources = { ...resources, ...res }
    })
    return resources
  }

  async init() {
    await this.runExtendOptionsHooks()
    this.resources = await this.runLoadResourcesHooks()
    this.isInitialized = true
    return this
  }

  t(key: string, options?: object) : string {
    if (!this.isInitialized) throw new Error('i18next is not yet initialized!')
    // return this.resources[key]
    return getProperty(this.resources, key)
  }
}

export default function (options?: object) {
  return new I18next(options)
}
