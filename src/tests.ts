import returnPromise from './lib/return-promise';
import { planCall, call } from './lib/test-plan';

export const tests = async (cb: () => Promise<void> | void) => {
	planCall();

	await returnPromise(cb());

	call();
};
