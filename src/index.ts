if (process && process.on && process.exit) {
	process.on('unhandledRejection', reason => {
		console.error(reason);
		process.exit(1);
	});
	process.on('uncaughtException', reason => {
		console.error(reason);
		process.exit(1);
	});
}

import './assertions/custom-assertions';

export * from './assertions';
export * from './it';
export * from './expect';
export * from './describe';
export * from './tests';
