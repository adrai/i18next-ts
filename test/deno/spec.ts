// @ts-ignore
import { assertStringContains } from 'https://deno.land/std/testing/asserts.ts'
// @ts-ignore
import i18next from '../../index.ts'
// @ts-ignore
const { test } = Deno

test('request', async () => {
  // before
  const translated = i18next.t('a key')
  assertStringContains(translated, 'a key')
})
