# i18next: learn once - translate everywhere
## visit ➡️ [i18next.com](https://www.i18next.com)


```javascript
import i18next from 'i18next'

const i18n = i18next({ some: 'options' })

i18n.onExtendOptions(async () => {
  const additionalOptions = await takeOptionsFromSomewhere()
  return additionalOptions
})

await i18n.init()

i18n.t('my.key')
```