import { tests, describe, addAssertion, it } from './src/index';
import delay from 'delay';

addAssertion(actual => {
	const even = actual % 2 === 0;
	return {
		ok: even,
		actual: even ? `even` : `odd`,
		expected: `even`,
	};
}, `isEven`);

tests(async () => {
	describe(`tests`, it => {
		it(`should add the numbers`, expect => {
			expect(1 + 2).toBe(3);
		});

		it(`should subtract the numbers`, expect => {
			expect(1 - 2).not.toBe(0);
		});
	});

	describe(`add() should work`, it => {
		it(`should add the numbers`, expect => {
			expect(1 + 2).toBe(3);
		});

		it(`should subtract the numbers and not be 0`, expect => {
			expect(1 - 2).not.toBe(0);
		});

		it(`should be even`, expect => {
			expect(4).custom(`isEven`);
		});
	});

	await describe(`try things async`, async it => {
		await it(`should still run async`, async expect => {
			await delay(500);

			expect(2).not.toBe(0);
		});

		it(`should still run async 2`, expect => {
			expect(2).not.toBe(0);
		});
	});

	await delay(400);

	await describe(`try things even more async`, async it => {
		await delay(400);

		it(`should pass`, expect => {
			expect(4).custom(`isEven`);
		});
	});

	describe(`test out the other methods`, it => {
		it(`should match regex`, expect => {
			expect('Elijah').toMatch(/Eli/);
		});
		it(`should match object`, expect => {
			expect({ a: 'b', c: { d: ['e'], f: 'g' } }).toMatchObject({
				a: 'b',
				c: { d: ['e'], f: 'g' },
			});
			expect({ a: 'b', c: { d: ['e'], f: 'g' } }).not.toMatchObject({
				a: 'b',
				c: { d: ['e'], f: 'd' },
			});
			expect([`this`, `that`, `then`]).toMatchObject([`this`, `that`, `then`]);
		});
		it(`should throw an error`, expect => {
			expect(() => {
				throw new Error(`hello!`);
			}).toThrow(/hello/);
		});
		it(`should have the right types`, expect => {
			expect('me').toBeType('string');
			expect({}).toBeType('object');
			expect(true).toBeType('boolean');
		});
	});
	it(`should server it's purpose`, expect => {
		expect(undefined).toBe(1);
		expect(undefined).toBe(undefined);
	});
});
