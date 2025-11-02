import type { Options } from 'tsup'

export default <Options>{
  entryPoints: ['src/*.ts', 'src/core/index.ts'],
  clean: true,
  format: ['esm'],
  dts: true,
  splitting: true,
}
