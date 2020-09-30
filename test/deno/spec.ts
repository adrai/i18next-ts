import { assertStringContains } from 'https://deno.land/std/testing/asserts.ts'
import i18next from '../../dist/deno/index.ts'
const { test } = Deno

test('request', async () => {
  // before
  const translated = i18next.t('a key')
  assertStringContains(translated, 'a key')
})
