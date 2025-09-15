import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.mjs',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  packages: 'external',
  sourcemap: true,
  minify: false
})

console.log('✅ Simple GM Bot build completed')
