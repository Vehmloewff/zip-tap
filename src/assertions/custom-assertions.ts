import { addAssertion, Assertion } from './';
import isDeepEqual from '../lib/obj-equal';

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
