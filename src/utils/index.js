'use strict';

module.exports.isClass = (v, ...parameters) => {
	const isConstructor = typeof v === 'function' && /^\s*class\s+/.test(v.toString());
	if (isConstructor) {
		// eslint-disable-next-line no-new
		new (v, parameters);
	}
	return isConstructor;
};

module.exports = {
	Cache: require('./Cache'),
	CheckAPIError: require('./CheckAPIError'),
	Intents: require('./Intents'),
	LimitedMap: require('./LimitedMap'),
	MakeAPIMessage: require('./MakeAPIMessage'),
	Requester: require('./Requester'),
};
