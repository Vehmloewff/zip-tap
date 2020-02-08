export default (val: any): string => {
	if (typeof val === `object`) return `'${JSON.stringify(val)}'`;
	else {
		const lines = String(val).split('\n');

		if (lines.length <= 1) return lines[0];

		let result = ``;
		lines.forEach(line => (result += `\n    - ${line}`));

		return result;
	}
};
