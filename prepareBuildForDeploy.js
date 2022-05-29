const fs = require('fs-extra');
const util = require('util');
const glob = util.promisify(require('glob'));
const path = require('path');

async function copyToSubdir(src, subdirName) {
	const dirs = await glob('*', { cwd: src, absolute: true, ignore: subdirName });
	const proms = dirs.map((file) => {
		const basename = path.basename(file);
		const dest = path.join(src, subdirName, basename);
		return fs.copy(file, dest);
	});
	return Promise.all(proms);
}

copyToSubdir('./dist/CS', 'CS')
	.then(() => {
		fs.copy('./dist/EN', './dist/CS/EN');
	})
	.then(() => {
		fs.copy('./dist/SK', './dist/CS/SK');
	})
	.then(() => {
		console.log('All languages directories successfuly copied!');
	})
	.catch((err) => {
		console.error(err);
	});

fs.copy('./dist/main.css', './dist/CS/main.css')
	.then(() => {
		console.log('main.css file copied!');
	})
	.catch((err) => {
		console.error(err);
	});

fs.copy('./dist/chatbots.js', './dist/CS/chatbots.js')
	.then(() => {
		console.log('chatbots.js file copied!');
	})
	.catch((err) => {
		console.error(err);
	});

fs.copy('./dist/assets', './dist/CS/assets')
	.then(() => {
		console.log('Assets folder for xolution.cz directory successfuly copied!');
	})
	.catch((err) => {
		console.error(err);
	});
