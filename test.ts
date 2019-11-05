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
	await describe(`tests`, it => {
		it(`should add the numbers`, expect => {
			expect(1 + 2).toBe(3);
		});

		it(`should subtract the numbers`, expect => {
			expect(1 - 2).not.toBe(0);
		});
	});

	await describe(`add() should work`, it => {
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
			await delay(3000);

			expect(2).not.toBe(0);
		});
	});

	await describe(`try things even more async`, async it => {
		await delay(4000);

		it(`should pass`, expect => {
			expect(5).custom(`isEven`);
		});
	});
})();
