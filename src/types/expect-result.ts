type CoreMatchers = {
	toBe: (value: any) => void;
	toMatch: (regexp: RegExp) => void;
	toMatchObject: (object: object) => void;
	toThrow: (error?: string | RegExp) => void;
	toBeType: (type: string) => void;
	custom: (indentifier: string, ...args: any[]) => void;
};
type Matchers = CoreMatchers & {
	not: CoreMatchers;
};

export default Matchers;
