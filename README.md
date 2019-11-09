# zip-tap

A fast, promise-based TAP testing library

_PS:  See [`zip-tap-reporter`](https://github.com/Vehmloewff/zip-tap-reporter) for a TAP reporter geared towards this module._

## Installation

```ssh
npm i -D zip-tap
```

## Usage

The syntax is easy, humman readable, and familiar.

```js
const { tests, describe } = require('zip-tap');

describe(`passing tests`, it => {
	it(`should add`, expect => {
		expect(1 + 1).toBe(2);
	});

	it(`should be the right type`, expect => {
		expect(2 + 1).toBeType('number');
		expect({}).not.toBeType('number');
	});
});
```

To bring promises into the game, just add in `await` and `async`.

If there are delays between `describe` functions, just wrap everyting in a `tests` function.

```js
const { tests, describe } = require('zip-tap');
const delay = require('delay');

tests(async () => {
	await delay(100);

	await describe(`first`, async it => {
		await delay(300);

		it(`should work with a promise`, async expect => {
			await delay(400);

			expect('Vehmloewff').toMatch(/loe/);
		});

		it(`should work without a promise`, expect => {
			expect({ a: 'b', c: { d: ['e'], f: 'g' } }).toMatchObject({
				a: 'b',
				c: { d: ['e'], f: 'g' },
			});
		});
	});

	await delay(200);

	describe(`second`, it => {
		it(`should be third`, expect => {
			expect(() => {
				throw new Error(`Hello!`);
			}).toThrow(/hello/i);
		});
	});
});
```

It is easy to add custom assertions:

```js
const { tests, describe, addAssertion } = require('zip-tap');

addAssertion((actual, expected) => {
	return {
		ok: actual.length === expected,
		actual: actual.length,
		expected: expected,
	};
}, `isLength`);

describe(`custom assertion`, it => {
	it(`should be the same length`, expect => {
		expect('foo').custom(`isLength`, 3);
	});
});
```

Example output:

```
TAP version 13
# tests
ok 1 - should add the numbers
ok 2 - should subtract the numbers
# add() should work
ok 3 - should add the numbers
not ok 4 - should subtract the numbers and not be 0
  ---
  message: failed at '!toBe'
  operator: !toBe
  at: !toBe(/home/vehmloewff/Code/zip-tap/dist/build.cjs.js:3252:95)
  expected: -1
  actual: -1
  ...
ok 5 - should be even
# try things async
ok 6 - should still run async
# try things even more async
ok 7 - should pass
1...7

# not ok
# success: 6
# failure: 1
```

## Can I contribute?

Sure!

```sh
# fork and clone repo
cd zip-tap
npm install
npm test -- -w
```

Issues and PR's are welcome!

_Just don't forget to `npm run lint`!_ :sweat_smile:

## License

[MIT](/LICENSE)
