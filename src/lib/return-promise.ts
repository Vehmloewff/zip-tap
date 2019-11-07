export default (val: any): Promise<any> => {
	if (val instanceof Promise) return val;
	return Promise.resolve(val);
};
