import giveString from './give-string';
import stacktrace from 'stacktrace-js';
import returnPromise from './return-promise';

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

addAssertion(toBe, `toBe`);

let isRunning = false;
function start() {
	if (!isRunning) {
		console.log(`TAP version 13`);
		isRunning = true;
	}
}

type CoreMatchers = {
	toBe: (value: any) => void;
	// toMatch: (regexp: RegExp) => void,
	// toMatchObject: (object: object) => void,
	// toThrow: (error?: string|RegExp) => void,
	// toBeType: (type: string) => void,
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

export const tests = (cb: Function) => {
	returnPromise(cb()).then(() => {
		console.log(`1...${count}`);
		console.log();
		console.log(`# ${exitStatus === 0 ? 'ok' : 'not ok'}`);
		console.log(`# success: ${count - exitStatus}`);
		console.log(`# failure: ${exitStatus}`);

		process.exit(exitStatus === 0 ? 0 : 1);
	});
};

export const describe: Describe = async (overview, cb) => {
	start();

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
				custom: createCustom(),
				not: {
					toBe: value => createCustom(true)(`toBe`, value),
					custom: createCustom(true),
				},
			};
		};

		await returnPromise(cb(expect));

		logResult(tests, description);
	};

	console.log(`# ${overview}`);

	await returnPromise(cb(it));

	return;
};
