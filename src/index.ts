import giveString from './give-string';
import stacktrace from 'stacktrace-js';
import returnPromise from './return-promise';
import isDeepEqual from './obj-equal';
import { finished } from 'stream';

export type AssertionResult = {
	ok: boolean;
	expected?: any;
	actual?: any;
};

export type Assertion = (actual: any, ...expected: any[]) => AssertionResult;

type NamedAssertion = {
	assertion: Assertion;
	name: string;
};
type NamedAssertionResult = AssertionResult & {
	name: string;
	stack?: string;
	message?: string;
	long?: string;
};

const namedAssertions: NamedAssertion[] = [];

const assertionNotFoundError = new Error(`The requested assertion was not found`);

export const addAssertion = (assertion: Assertion, name: string) => {
	namedAssertions.push({
		assertion,
		name,
	});
};

const findAssertionIndex = (name: string) => {
	const index = namedAssertions.findIndex(assertion => assertion.name === name);

	if (index === -1) throw assertionNotFoundError;

	return index;
};

export const removeAssertion = (name: string) => {
	namedAssertions.splice(findAssertionIndex(name), 1);
};
export const callAssertion = (name: string, actual: any, ...expected: any[]) =>
	namedAssertions[findAssertionIndex(name)].assertion(actual, ...expected);

export const toBe: Assertion = (actual, expected) => {
	return {
		ok: actual === expected,
		actual,
		expected,
	};
};
export const toMatch: Assertion = (actual, expected: RegExp) => {
	return {
		ok: expected.test(actual),
		actual,
	};
};
export const toMatchObject: Assertion = (actual, expected: object) => {
	return {
		ok: isDeepEqual(actual, expected),
		actual,
		expected,
	};
};
export const toThrow: Assertion = (fn, expectedError?: Error | String | RegExp) => {
	try {
		fn();
		return { ok: false };
	} catch (error) {
		if (!expectedError) return { ok: true };
		else if (expectedError instanceof Error) {
			return {
				ok: error.message === expectedError.message,
				actual: error.message,
				expected: expectedError.message,
			};
		} else if (typeof expectedError === 'string') {
			return {
				ok: error.message === expectedError,
				actual: error.message,
				expected: expectedError,
			};
		} else if (expectedError instanceof RegExp) {
			return {
				ok: expectedError.test(error.message),
				actual: error.message,
			};
		} else {
			throw new Error(
				`The second argument 'toThrow' must be an Error constructor, regex, or string`
			);
		}
	}
};
export const toBeType: Assertion = (value, type: string) => {
	return {
		ok: typeof value === type,
		actual: typeof value,
		expected: type,
	};
};

addAssertion(toBe, `toBe`);
addAssertion(toMatch, `toMatch`);
addAssertion(toMatchObject, `toMatchObject`);
addAssertion(toThrow, `toThrow`);
addAssertion(toBeType, `toBeType`);

type CoreMatchers = {
	toBe: (value: any) => void;
	toMatch: (regexp: RegExp) => void;
	toMatchObject: (object: object) => void;
	toThrow: (error?: string | RegExp) => void;
	toBeType: (type: string) => void;
	custom: (indentifier: string, ...args: any[]) => void;
};
export type Matchers = CoreMatchers & {
	not: CoreMatchers;
};
export type Expect = (actual: any) => Matchers;
export type It = (description: string, cb: (expect: Expect) => void) => Promise<void>;
export type Describe = (overview: string, cb: (it: It) => void) => Promise<void>;

let count = 0;
let exitStatus = 0;
const logResult = (tests: NamedAssertionResult[], description: string) => {
	count++;

	let ok = true;
	let metaData: NamedAssertionResult = null;

	for (let testIndex in tests) {
		const test = tests[testIndex];

		if (!test.ok) {
			ok = false;
			metaData = test;

			break;
		}
	}

	if (ok) console.log(`ok ${count} - ${description}`);
	else {
		exitStatus++;

		console.log(`not ok ${count} - ${description}`);
		console.log(`  ---`);
		if (metaData.message) console.log(`  message: ${metaData.message}`);
		else console.log(`  message: failed at '${metaData.name}'`);
		console.log(`  operator: ${metaData.name}`);
		if (metaData.stack) console.log(`  at: ${metaData.name}(${metaData.stack})`);
		if (metaData.expected) console.log(`  expected: ${giveString(metaData.expected)}`);
		if (metaData.actual) console.log(`  actual: ${giveString(metaData.actual)}`);
		console.log(`  ...`);
		if (metaData.long) console.log(metaData.long);
	}
};

const it: It = async (description, cb) => {
	const tests: NamedAssertionResult[] = [];

	const expect: Expect = (actual: any) => {
		type CustomAssertion = (indentifier: string, ...expected: any[]) => void;

		const createCustom = (not?: boolean): CustomAssertion => {
			return (indentifier: string, ...expected) => {
				let result: AssertionResult;
				let stack: string;
				let message: string;
				let long: string;

				try {
					result = callAssertion(indentifier, actual, ...expected);
				} catch (e) {
					result = {
						ok: false,
					};
					long = e;
				}

				const caller = stacktrace.getSync()[1];
				stack = `${caller.fileName}:${caller.lineNumber}:${caller.columnNumber}`;

				const namedResult: NamedAssertionResult = {
					...result,
					name: indentifier,
					stack,
					message,
					long,
				};

				if (not) {
					namedResult.ok = !namedResult.ok;
					namedResult.name = `!${namedResult.name}`;
				}
				tests.push(namedResult);
			};
		};

		return {
			toBe: value => createCustom()(`toBe`, value),
			toMatch: regex => createCustom()(`toMatch`, regex),
			toMatchObject: obj => createCustom()(`toMatchObject`, obj),
			toThrow: error => createCustom()(`toThrow`, error),
			toBeType: type => createCustom()(`toBeType`, type),
			custom: createCustom(),
			not: {
				toBe: value => createCustom(true)(`toBe`, value),
				toMatch: regex => createCustom(true)(`toMatch`, regex),
				toMatchObject: obj => createCustom(true)(`toMatchObject`, obj),
				toThrow: error => createCustom(true)(`toThrow`, error),
				toBeType: type => createCustom(true)(`toBeType`, type),
				custom: createCustom(true),
			},
		};
	};

	cb(expect);

	logResult(tests, description);
};

type startOptions = {
	overview: string;
	cb: Function;
};

let testsToRun: startOptions[] = [];
let isRunning = false;
function start(opts: startOptions) {
	testsToRun.push(opts);

	if (!isRunning) {
		console.log(`TAP version 13`);
		isRunning = true;

		runTests();
	}
}

export const describe: Describe = async (overview, cb) => {
	start({
		overview,
		cb,
	});
};

async function runTests() {
	const test = testsToRun[0];
	if (!test) return done();

	console.log(`# ${test.overview}`);
	await returnPromise(test.cb(it));

	testsToRun.shift();

	runTests();
}

function done() {
	const passed = exitStatus === 0;

	console.log(`1...${count}`);
	console.log();
	console.log(`# ${passed ? 'ok' : 'not ok'}`);
	console.log(`# success: ${count - exitStatus}`);
	console.log(`# failure: ${exitStatus}`);

	if (!passed) process.exit(passed ? 0 : 1);
}

// TODO: remove this in next major version
export const tests = (cb: Function) => {
	cb();
}
