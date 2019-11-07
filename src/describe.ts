import { createIt, It } from './it';
import returnPromise from './lib/return-promise';
import { planCall, call } from './lib/test-plan';

export const describe = async (
	overview: string,
	cb: (it: It) => Promise<void> | void
): Promise<void> => {
	planCall();

	let called = false;
	const logHeader = () => {
		if (!called) console.log(`# ${overview}`);

		called = true;
	};

	await returnPromise(cb(createIt(logHeader)));

	call();
};
