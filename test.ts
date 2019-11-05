import { describe, addAssertion } from './src';

addAssertion((actual) => {
	const even = actual % 2 === 0;
	return {
		ok: even,
		actual: even ? `even` : `odd`,
		expected: `even`,
	};
}, `isEven`);

describe(`tests`, (it) => {
	it(`should add the numbers`, (expect) => {
		expect(1 + 2).toBe(3);
	});

	it(`should subtract the numbers`, (expect) => {
		expect(1 - 2).not.toBe(0);
	});
});

describe(`add() should work`, (it) => {
	it(`should add the numbers`, (expect) => {
		expect(1 + 2).toBe(3);
	});

	it(`should subtract the numbers and not be 0`, (expect) => {
		expect(1 - 2).not.toBe(0);
	});

	it(`should be even`, (expect) => {
		expect(5).custom(`isEven`);
	});
});
