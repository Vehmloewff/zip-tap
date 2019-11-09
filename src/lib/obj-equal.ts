import flatten from 'flat';

const isEqual = (x: any, y: any): boolean => {
	const flatX = <any>flatten(x);
	const flatY = <any>flatten(y);

	let matches = true;

	Object.keys(flatX).forEach(key => {
		const value1 = flatX[key];
		const value2 = flatY[key];

		if (value1 !== value2) matches = false;
	});

	Object.keys(flatY).forEach(key => {
		const value1 = flatX[key];
		const value2 = flatY[key];

		if (value1 !== value2) matches = false;
	});

	return matches;
};

export default isEqual;
