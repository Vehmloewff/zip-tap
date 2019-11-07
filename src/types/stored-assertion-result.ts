import { AssertionResult } from '../assertions';

type StoredAssertionResult = AssertionResult & {
	location?: string,
	name: string,
}

export default StoredAssertionResult;
