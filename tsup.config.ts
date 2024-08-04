import type { Options } from 'tsup'

export default <Options>{
  entryPoints: ['src/*.ts'],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  cjsInterop: true,
  splitting: true,
  onSuccess: 'npm run build:fix',
}
