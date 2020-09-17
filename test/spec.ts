import i18next from '../src/index'
import should from 'should'

describe('i18next', () => {

  it('it should work', () => {
    const translated = i18next.t('a key')
    should(translated).be.of.type('string')
  })

})
