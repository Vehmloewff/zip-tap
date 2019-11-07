import { Expect, createExpect } from './expect';
import StoredAssertionResult from './types/stored-assertion-result';
import logTest from './lib/log-test';
import { plan } from './lib/test-plan';
import returnPromise from './lib/return-promise';

export type It = (
	description: string,
	cb: (expect: Expect) => Promise<void> | void
) => Promise<void>;

export const createIt = (logHeader?: (count: number) => void): It => async (description, cb) => {
	plan();

	const tests: StoredAssertionResult[] = [];

	const onTestDone = (test: StoredAssertionResult) => tests.push(test);

	await returnPromise(cb(createExpect(onTestDone)));

	logTest(tests, description, logHeader);
};

export const it: It = createIt();
