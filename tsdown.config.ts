import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: true,
  entry: ['src/*.ts', 'src/core/index.ts'],
})
