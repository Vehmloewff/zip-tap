import StoredAssertionResult from '../types/stored-assertion-result';
import giveString from './give-string';
import { planned, unPlan, unPlanCalls, undoCalls, calls, plannedCalls } from './test-plan';

let count = 0;
let fails = 0;
let timeout: NodeJS.Timeout = null;

export default (
	tests: StoredAssertionResult[],
	description: string,
	logHeader: (count: number) => void
) => {
	count++;

	let failingTest: StoredAssertionResult = null;

	for (let testIndex in tests) {
		const test = tests[testIndex];

		if (!test.ok) failingTest = test;
	}

	const logStart = () => console.log(`TAP version 13`);

	const logFailure = () => {
		console.log(`not ok ${count} - ${description}`);
		console.log(`  ---`);
		if (failingTest.message) console.log(`  message: ${failingTest.message}`);
		else console.log(`  message: failed at '${failingTest.name}'`);
		console.log(`  operator: ${failingTest.name}`);
		if (failingTest.location) console.log(`  at: ${failingTest.name}(${failingTest.location})`);
		if (failingTest.expected) console.log(`  expected: ${giveString(failingTest.expected)}`);
		if (failingTest.actual) console.log(`  actual: ${giveString(failingTest.actual)}`);
		console.log(`  ...`);

		fails++;
	};

	const finish = () => {
		const passed = fails === 0;

		console.log(`1...${count}`);
		console.log();
		console.log(`# ${passed ? 'ok' : 'not ok'}`);
		console.log(`# success: ${count - fails}`);
		console.log(`# failure: ${fails}`);

		count = 0;
		fails = 0;
		unPlan();
		unPlanCalls();
		undoCalls();

		if (!passed) process.exit(1);
	};

	if (count === 1) logStart();

	if (logHeader) {
		logHeader(count);
	}

	if (!failingTest) console.log(`ok ${count} - ${description}`);
	else logFailure();

	clearTimeout(timeout);

	timeout = setTimeout(() => {
		if (planned() >= count && calls() >= plannedCalls()) finish();
	}, 100);
};
