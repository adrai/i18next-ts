import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: 'src/index.ts', // our source file
  output: [
    {
      // dir: 'dist/cjs',
      // preserveModules: true,
      file: pkg.main,
      format: 'cjs'
    },
    {
      // dir: 'dist/esm',
      // preserveModules: true,
      file: pkg.module,
      format: 'es' // the preferred format
    },
    {
      file: pkg.browser,
      format: 'iife',
      name: 'i18next' // the global which can be used in a browser
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {})
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      rollupCommonJSResolveHack: false,
      clean: true
    }),
    terser() // minifies generated bundles
  ]
}
