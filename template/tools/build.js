const Module = require('module');
const path = require('path');

const buildDeps = require('./config.json').extraMetadata.buildDependencies
		|| require('../package.json').buildDependencies;
const opts = ['-c', require.resolve('./config.json')];
const cli = path.join(path.dirname(require.resolve('electron-builder/package.json')),
		require('electron-builder/package.json').bin['electron-builder']);

function getDeps(req, mod) {
	const depMeta = req(mod + '/package.json');
	depMeta.dependencies = depMeta.dependencies || {};
	const keys = Object.keys(depMeta.dependencies);
	if(keys.length === 0) {
		return keys;
	} else if(keys.length > 0) {
		const base = path.dirname(req.resolve(mod + '/package.json'));
		const pseudo = path.join(base, '@root');
		const parentMod = new Module(pseudo);
		parentMod.filename = pseudo;
		parentMod.paths = Module._nodeModulePaths(base);
		const reqDep = parentMod.require.bind(parentMod);
		reqDep.resolve = m => Module._resolveFilename(m, parentMod);
		return keys.reduce((list, dep) => {
			return dedupeConcat(list, getDeps(reqDep, dep));
		}, keys.slice());
	}
}

function dedupeConcat(a, b) {
	return a.concat(b.filter(item => !a.includes(item)));
}

if(buildDeps === false || (Array.isArray(buildDeps) && buildDeps.length === 0)) {
	opts.push('-c.files=!node_modules{,/**/*}');
} else if(Array.isArray(buildDeps) && buildDeps.length > 0) {
	const deplist = buildDeps.reduce((list, dep) => {
		return dedupeConcat(list, getDeps(require, dep));
	}, buildDeps.slice());
	opts.push('-c.files=!node_modules/!(' + deplist.join('|') + ')/**/*');
}

process.argv.splice(2, 0, ...opts)
require(cli);
