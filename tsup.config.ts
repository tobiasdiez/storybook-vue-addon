import type { Options } from 'tsup'

export default {
  clean: true,
  dts: true,
  entryPoints: ['src/*.ts', 'src/core/index.ts'],
  format: ['esm'],
  splitting: true,
} as Options
