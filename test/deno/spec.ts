// @ts-ignore
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'
// @ts-ignore
import i18next from '../../index.ts'
// @ts-ignore
const { test } = Deno

test('onExtendOptions', async () => {
  // before
  const i18nextInstance = i18next({ some: 'options' })
  i18nextInstance.addHook('extendOptions', () => {
    return { add: 'this' }
  })
  i18nextInstance.addHook('extendOptions', () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ another: 'thing' }), 200)
    })
  })
  i18nextInstance.addHook('loadResources', () => ({ 'a key': 'a value' }))
  await i18nextInstance.init()
  assertEquals(i18nextInstance.options, {
    some: 'options',
    add: 'this',
    another: 'thing'
  })
  const translated = i18nextInstance.t('a key')
  assertEquals(translated, 'a value')
})
