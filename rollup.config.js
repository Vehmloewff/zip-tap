import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';
import execute from 'rollup-plugin-command';

const name = 'zip-tap';
const sourcemap = true;
const prod = process.env.NODE_ENV === 'production';
const runningTests = process.env.NODE_ENV === 'test';
const watching = process.env.ROLLUP_WATCH;

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
		!prod && !runningTests && execute(`node ${pkg.main}`, { exitOnFail: !watching }),
		typescript({
			typescript: require('typescript'),
		}),
	],
};
