class I18next {
  constructor(){}

  init (options: object) {
    console.log('inited', options)
  }

  t (key: string, options?: object) : string {
    return `whould have translated ${key}`
  }
}

export default new I18next()
