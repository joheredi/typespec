import typescript from 'rollup-plugin-typescript2';
import { terser } from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    json(),
    typescript({ tsconfig: './tsconfig.json' }),
    babel({
      extensions: ['.ts', '.tsx'],
      babelHelpers: 'bundled',
    }),
    terser(),
  ],
};