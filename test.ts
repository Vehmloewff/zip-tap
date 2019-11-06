import { describe, addAssertion } from './src';
import delay from 'delay';

addAssertion(actual => {
	const even = actual % 2 === 0;
	return {
		ok: even,
		actual: even ? `even` : `odd`,
		expected: `even`,
	};
}, `isEven`);

(async function() {
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
			await delay(300);

			expect(2).not.toBe(0);
		});

		it(`should still run async`, expect => {
			expect(2).not.toBe(0);
		});
	});

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
})();
