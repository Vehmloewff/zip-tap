import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';
import execute from 'rollup-plugin-execute';

const name = 'todo';
const sourcemap = true;
const prod = process.env.NODE_ENV === 'production';

const sharedOutputOptions = {
	name,
	sourcemap,
};

const output = [{ file: pkg.main, format: 'cjs', ...sharedOutputOptions }];

if (prod) output.push({ file: pkg.module, format: 'es', ...sharedOutputOptions });

export default {
	input: prod ? 'src/index.ts' : 'test.ts',
	output,
	plugins: [
		resolve(),
		commonjs(),
		!prod && execute(`node ${pkg.main}`),
		typescript({
			typescript: require('typescript'),
		}),
	],
};
