import i18next from '../src/index'
import should from 'should'

describe('i18next', () => {

  it('onExtendOptions', async () => {
    const i18nextInstance = i18next({ some: 'options' })
    i18nextInstance.onExtendOptions(() => {
      return { add: 'this' }
    })
    i18nextInstance.onExtendOptions(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ another: 'thing' }), 200)
      })
    })
    await i18nextInstance.init()
    should(i18nextInstance.options).have.properties({
      some: 'options',
      add: 'this',
      another: 'thing'
    })
    const translated = i18nextInstance.t('a key')
    should(translated).be.of.type('string')
  })

})
