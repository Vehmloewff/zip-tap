// Types
export type AssertionResult = {
	ok: boolean;
	expected?: any;
	actual?: any;
	message?: string;
};
export type Assertion = (actual: any, ...expected: any[]) => AssertionResult;

// Work
const assertions: { assertion: Assertion; name: string }[] = [];

const assertionNotFoundError = new Error(`The requested assertion was not found`);

export const addAssertion = (assertion: Assertion, name: string) => {
	assertions.push({
		assertion,
		name,
	});
};

const findAssertionIndex = (name: string) => {
	const index = assertions.findIndex(assertion => assertion.name === name);

	if (index === -1) throw assertionNotFoundError;

	return index;
};

export const removeAssertion = (name: string) => {
	assertions.splice(findAssertionIndex(name), 1);
};
export const callAssertion = (name: string, actual: any, ...expected: any[]) =>
	assertions[findAssertionIndex(name)].assertion(actual, ...expected);
