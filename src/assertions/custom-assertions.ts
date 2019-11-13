import { addAssertion, Assertion, AssertionResult } from './';
import isDeepEqual from '../lib/obj-equal';

export const toBe: Assertion = (actual, expected) => {
	return {
		ok: actual === expected,
		actual,
		expected,
		message: `The expected value did not match the actual`,
	};
};
export const toMatch: Assertion = (actual, expected: RegExp) => {
	return {
		ok: expected.test(actual),
		actual,
		message: `The given value did not match the following regex: ${String(expected)}`,
	};
};
export const toMatchObject: Assertion = (actual, expected: object) => {
	return {
		ok: isDeepEqual(actual, expected),
		actual,
		expected,
		message: `The expected object did not match the actual one`,
	};
};
export const toThrow: Assertion = (fn, expectedError?: Error | String | RegExp) => {
	let message = `The passed function did not throw`;
	let toReturn: AssertionResult = { ok: false };

	try {
		fn();
		return { ok: false };
	} catch (error) {
		if (!expectedError) return { ok: true };
		else if (expectedError instanceof Error) {
			toReturn = {
				ok: error.message === expectedError.message,
				actual: error.message,
				expected: expectedError.message,
			};
			message += ` an error that matches "${expectedError.message}"`;
		} else if (typeof expectedError === 'string') {
			toReturn = {
				ok: error.message === expectedError,
				actual: error.message,
				expected: expectedError,
			};
			message += ` an error that matches "${expectedError}"`;
		} else if (expectedError instanceof RegExp) {
			toReturn = {
				ok: expectedError.test(error.message),
				actual: error.message,
			};
			message += ` an error that matches "${expectedError}"`;
		} else {
			throw new Error(
				`The second argument 'toThrow' must be an Error constructor, regex, or string`
			);
		}
	}
	return { ...toReturn, message };
};
export const toBeType: Assertion = (value, type: string) => {
	return {
		ok: typeof value === type,
		actual: typeof value,
		expected: type,
		message: `The passed value was not of type "${type}"`,
	};
};

addAssertion(toBe, `toBe`);
addAssertion(toMatch, `toMatch`);
addAssertion(toMatchObject, `toMatchObject`);
addAssertion(toThrow, `toThrow`);
addAssertion(toBeType, `toBeType`);
