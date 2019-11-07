export default (val: any): string => {
	if (typeof val === `object`) return JSON.stringify(val);
	else return String(val);
};
