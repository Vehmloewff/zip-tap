import Assertions from './types/expect-result';
import StoredAssertionResult from './types/stored-assertion-result';
import { callAssertion } from './assertions';
import stacktrace from 'stacktrace-js';

export type Expect = (value: any) => Assertions;

type AddTestMethod = (values: StoredAssertionResult) => void;
type CustomAssertion = (indentifier: string, ...args: any[]) => void;

export const createExpect = (addTestMethod: AddTestMethod): Expect => actual => {
	const createCustomCaller = createAssertionCaller(addTestMethod, actual);

	return {
		toBe: value => createCustomCaller()(`toBe`, value),
		toBeTruthy: value => createCustomCaller()(`toBeTruthy`),
		toMatch: regex => createCustomCaller()(`toMatch`, regex),
		toMatchObject: obj => createCustomCaller()(`toMatchObject`, obj),
		toThrow: error => createCustomCaller()(`toThrow`, error),
		toBeType: type => createCustomCaller()(`toBeType`, type),
		custom: createCustomCaller(),
		not: {
			toBe: value => createCustomCaller(true)(`toBe`, value),
			toBeTruthy: value => createCustomCaller(true)(`toBeTruthy`),
			toMatch: regex => createCustomCaller(true)(`toMatch`, regex),
			toMatchObject: obj => createCustomCaller(true)(`toMatchObject`, obj),
			toThrow: error => createCustomCaller(true)(`toThrow`, error),
			toBeType: type => createCustomCaller(true)(`toBeType`, type),
			custom: createCustomCaller(true),
		},
	};
};

const createAssertionCaller = (addTestMethod: AddTestMethod, actual: any) => (
	not?: boolean
): CustomAssertion => (indentifier, ...expected) => {
	const result = callAssertion(indentifier, actual, ...expected);

	const caller = stacktrace.getSync()[2];
	const callerLocation = `${caller.fileName}:${caller.lineNumber}:${caller.columnNumber}`;

	const newResult: StoredAssertionResult = {
		...result,
		name: indentifier,
		location: callerLocation,
	};

	if (not) {
		newResult.ok = !newResult.ok;
		newResult.name = `!` + newResult.name;

		if (newResult.hasOwnProperty('expected')) newResult.expected = `!` + newResult.expected;
	}

	addTestMethod(newResult);
};
